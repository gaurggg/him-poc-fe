"use client";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import {
  TicketCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];

const STATUS_STYLE: Record<string, { icon: any; cls: string }> = {
  Open:        { icon: AlertCircle,  cls: "status-badge status-low" },
  "In Progress":{ icon: Clock,       cls: "status-badge status-pending" },
  Resolved:    { icon: CheckCircle2, cls: "status-badge status-ok" },
  Closed:      { icon: TicketCheck,  cls: "status-badge status-ordered" },
};

function TicketsContent() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tickets`);
      setTickets(res.data.tickets);
    } catch {
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const updateStatus = async (ticket_id: string, status: string) => {
    try {
      await axios.patch(`${API}/tickets/${ticket_id}/status`, {
        status,
        notes: notes[ticket_id] || undefined,
      });
      toast.success(`Ticket ${ticket_id} → ${status}`);
      fetchTickets();
    } catch {
      toast.error("Failed to update ticket");
    }
  };

  const clearResolved = async () => {
    try {
      const res = await axios.delete(`${API}/tickets/clear`);
      toast.success(res.data.message);
      fetchTickets();
    } catch {
      toast.error("Failed to clear tickets");
    }
  };

  const openCount  = tickets.filter((t) => t.status === "Open").length;
  const inProgCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => ["Resolved","Closed"].includes(t.status)).length;

  if (loading)
    return (
      <div className="space-y-3 max-w-5xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl h-32" style={{ background: "#1E293B" }} />
        ))}
      </div>
    );

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Header ──────────────────────────── */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em", marginBottom: "4px" }}>
            Support Tickets
          </h1>
          <p style={{ fontSize: "13px", color: "#475569" }}>
            Customer issues escalated via chatbot · {tickets.length} total
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={fetchTickets}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
              color: "#94A3B8", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
            }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
          {resolvedCount > 0 && (
            <button
              onClick={clearResolved}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                color: "#EF4444", background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)", cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.14)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)")}
            >
              <Trash2 size={12} /> Clear Resolved
            </button>
          )}
        </div>
      </div>

      {/* ── Stat row ────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 fade-in">
        {[
          { label: "Open",        count: openCount,    color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
          { label: "In Progress", count: inProgCount,  color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
          { label: "Resolved",    count: resolvedCount,color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
        ].map(({ label, count, color, bg }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              {label}
            </p>
            <p style={{ fontSize: "32px", fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* ── Empty state ─────────────────────── */}
      {tickets.length === 0 ? (
        <div
          className="rounded-2xl flex flex-col items-center justify-center text-center fade-in"
          style={{ padding: "64px 32px", background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#0F172A" }}>
            <TicketCheck size={26} style={{ color: "#334155" }} />
          </div>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px" }}>
            No support tickets yet
          </p>
          <p style={{ fontSize: "13px", color: "#475569", maxWidth: "340px", lineHeight: 1.6 }}>
            Tickets are automatically created when a customer's chatbot query is unresolved after 3 messages.
          </p>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {tickets.map((ticket) => {
            const statusCfg = STATUS_STYLE[ticket.status] || STATUS_STYLE["Open"];
            const StatusIcon = statusCfg.icon;
            const isExpanded = expandedId === ticket.ticket_id;

            return (
              <div
                key={ticket.ticket_id}
                className="rounded-xl"
                style={{
                  background: "#1E293B",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `4px solid ${
                    ticket.status === "Open" ? "#EF4444"
                    : ticket.status === "In Progress" ? "#F59E0B"
                    : "#22C55E"
                  }`,
                  overflow: "hidden",
                }}
              >
                {/* ── Ticket header ─── */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : ticket.ticket_id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#E2E8F0", fontFamily: "'Courier New', monospace" }}>
                          {ticket.ticket_id}
                        </span>
                        <span className={statusCfg.cls}>
                          <StatusIcon size={10} /> {ticket.status}
                        </span>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: ticket.priority === "High" ? "#EF4444" : "#F59E0B", background: ticket.priority === "High" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: "999px", border: `1px solid ${ticket.priority === "High" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                          {ticket.priority || "Medium"} Priority
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: isExpanded ? undefined : 2, WebkitBoxOrient: "vertical", overflow: isExpanded ? "visible" : "hidden" }}>
                        <MessageSquare size={11} style={{ display: "inline", marginRight: "5px", color: "#334155" }} />
                        {ticket.issue_summary}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        color: "#475569",
                        flexShrink: 0,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "11px", color: "#334155", marginTop: "10px" }}>
                    Created {new Date(ticket.created_at).toLocaleString()}
                    {ticket.resolved_at && ` · Resolved ${new Date(ticket.resolved_at).toLocaleString()}`}
                  </p>
                </div>

                {/* ── Expanded actions ─ */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "14px 20px 18px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                      Update Ticket
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <textarea
                        placeholder="Add internal notes (optional)..."
                        value={notes[ticket.ticket_id] || ""}
                        onChange={(e) => setNotes({ ...notes, [ticket.ticket_id]: e.target.value })}
                        style={{
                          flex: 1, padding: "8px 12px", borderRadius: "8px",
                          background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)",
                          color: "#E2E8F0", fontSize: "12px", resize: "none",
                          outline: "none", fontFamily: "'Inter', sans-serif",
                        }}
                        rows={2}
                      />
                      <div className="flex flex-col gap-2" style={{ minWidth: "160px" }}>
                        {STATUS_OPTIONS.filter((s) => s !== ticket.status).map((s) => (
                          <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); updateStatus(ticket.ticket_id, s); }}
                            style={{
                              padding: "7px 14px", borderRadius: "7px", fontSize: "12px",
                              fontWeight: 600, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
                              background: s === "Resolved" ? "rgba(34,197,94,0.12)" : s === "In Progress" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
                              color: s === "Resolved" ? "#22C55E" : s === "In Progress" ? "#F59E0B" : "#94A3B8",
                              transition: "all 0.15s ease",
                            }}
                          >
                            → Mark {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {ticket.notes && (
                      <p style={{ fontSize: "12px", color: "#64748B", marginTop: "10px", fontStyle: "italic" }}>
                        Notes: {ticket.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div style={{ fontSize: "13px", color: "#475569" }}>Loading tickets...</div>}>
      <TicketsContent />
    </Suspense>
  );
}
