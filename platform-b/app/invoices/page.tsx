"use client";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import {
  FileText, Clock, CheckCircle, Package, BrainCircuit,
  Trash2, AlertCircle, History, ChevronDown, ChevronUp,
  RefreshCw, TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function InvoicesContent() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "history">("orders");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const [invRes, histRes] = await Promise.all([
        axios.get(`${API}/invoices`),
        axios.get(`${API}/invoices/history`),
      ]);
      setInvoices(invRes.data.invoices);
      setHistory(histRes.data.history);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await axios.patch(`${API}/invoices/${id}/status`, { status });
      if (status === "Received") {
        toast.success("✅ Purchase order received — inventory updated!", { duration: 4000 });
      } else {
        toast.success(`Purchase order marked as ${status}`);
      }
      await fetchAll(); // refresh both invoices + history
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearInvoices = async () => {
    try {
      const res = await axios.delete(`${API}/invoices/clear`);
      toast.success(res.data.message);
      fetchAll();
    } catch {
      toast.error("Failed to clear");
    }
  };

  const activeOrders = invoices.filter((i) => !["Received", "Cancelled"].includes(i.status));
  const completedOrders = invoices.filter((i) => ["Received", "Cancelled"].includes(i.status));

  if (loading)
    return (
      <div className="space-y-3 max-w-5xl">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-xl h-44" style={{ background: "#1E293B" }} />
        ))}
      </div>
    );

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Header ─────────────────────────── */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em", marginBottom: "4px" }}>
            Purchase Orders
          </h1>
          <p style={{ fontSize: "13px", color: "#475569" }}>
            AI-generated restock orders · {activeOrders.length} active · {history.length} restock events
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={fetchAll}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
              color: "#94A3B8", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
            }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
          {completedOrders.length > 0 && (
            <button
              onClick={clearInvoices}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                color: "#EF4444", background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)", cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.14)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)")}
            >
              <Trash2 size={13} /> Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────── */}
      <div
        style={{
          display: "flex", gap: "4px", padding: "4px", borderRadius: "10px",
          background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)",
          width: "fit-content",
        }}
      >
        {(["orders", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 18px", borderRadius: "7px", fontSize: "13px",
              fontWeight: 600, cursor: "pointer", border: "none",
              background: tab === t ? "#3B82F6" : "transparent",
              color: tab === t ? "white" : "#475569",
              transition: "all 0.15s ease",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            {t === "orders" ? <><FileText size={13} /> Purchase Orders</> : <><History size={13} /> Restock History</>}
          </button>
        ))}
      </div>

      {/* ── Purchase Orders tab ─────────────── */}
      {tab === "orders" && (
        <>
          {invoices.length === 0 ? (
            <div
              className="rounded-2xl flex flex-col items-center justify-center text-center fade-in"
              style={{ padding: "64px 32px", background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#0F172A" }}>
                <FileText size={26} style={{ color: "#334155" }} />
              </div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px" }}>
                No purchase orders yet
              </p>
              <p style={{ fontSize: "13px", color: "#475569", maxWidth: "360px", lineHeight: 1.6 }}>
                Run the AI Vendor Agent from the Inventory page to automatically generate restock orders.
              </p>
            </div>
          ) : (
            <div className="space-y-4 fade-in">

              {/* Active orders */}
              {activeOrders.length > 0 && (
                <div className="space-y-4">
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Active Orders ({activeOrders.length})
                  </p>
                  {activeOrders.map((inv, idx) => (
                    <InvoiceCard key={inv.id} inv={inv} idx={idx} onUpdate={updateStatus} updatingId={updatingId} />
                  ))}
                </div>
              )}

              {/* Completed orders */}
              {completedOrders.length > 0 && (
                <div className="space-y-4">
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "8px" }}>
                    Completed ({completedOrders.length})
                  </p>
                  {completedOrders.map((inv, idx) => (
                    <InvoiceCard key={inv.id} inv={inv} idx={idx} onUpdate={updateStatus} updatingId={updatingId} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Restock History tab ─────────────── */}
      {tab === "history" && (
        <>
          {history.length === 0 ? (
            <div
              className="rounded-2xl flex flex-col items-center justify-center text-center fade-in"
              style={{ padding: "64px 32px", background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#0F172A" }}>
                <History size={26} style={{ color: "#334155" }} />
              </div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px" }}>
                No restock history yet
              </p>
              <p style={{ fontSize: "13px", color: "#475569", maxWidth: "360px", lineHeight: 1.6 }}>
                When you mark a purchase order as "Received", the inventory is updated and the event is logged here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 fade-in">
              {history.map((h, i) => (
                <div
                  key={h._id || i}
                  className="rounded-xl p-5"
                  style={{
                    background: "#1E293B",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderLeft: "4px solid #22C55E",
                    animation: `fadeUp 0.35s ease ${i * 0.04}s both`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <TrendingUp size={14} style={{ color: "#22C55E" }} />
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#E2E8F0" }}>
                          {h.product_name}
                        </span>
                        <span style={{ fontSize: "11px", fontFamily: "'Courier New', monospace", color: "#94A3B8", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {h.invoice_ref}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#475569", marginBottom: "8px" }}>
                        Vendor: <span style={{ color: "#94A3B8" }}>{h.vendor}</span>
                      </p>

                      {/* Per-size breakdown */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {(h.restocked || []).map((r: any) => (
                          <span
                            key={r.size}
                            style={{
                              fontSize: "11px", fontWeight: 600, padding: "3px 10px",
                              borderRadius: "6px", background: "rgba(34,197,94,0.1)",
                              border: "1px solid rgba(34,197,94,0.2)", color: "#22C55E",
                            }}
                          >
                            {r.size}: +{r.added} units
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "22px", fontWeight: 800, color: "#22C55E", lineHeight: 1 }}>
                        +{h.total_added}
                      </p>
                      <p style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
                        units restocked
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "11px", color: "#334155", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    Received {new Date(h.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InvoiceCard({
  inv,
  idx,
  onUpdate,
  updatingId,
}: {
  inv: any;
  idx: number;
  onUpdate: (id: string, status: string) => void;
  updatingId: string | null;
}) {
  const isHigh       = inv.priority === "HIGH";
  const isUpdating   = updatingId === inv.id;
  const isCompleted  = ["Received", "Cancelled"].includes(inv.status);

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "#1E293B",
        border: `1px solid ${isCompleted ? "rgba(255,255,255,0.05)" : isHigh ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderLeft: `4px solid ${isCompleted ? "#22C55E" : isHigh ? "#EF4444" : "#3B82F6"}`,
        opacity: isCompleted ? 0.75 : 1,
        animation: `fadeUp 0.35s ease ${idx * 0.05}s both`,
      }}
    >
      <div className="flex flex-col lg:flex-row gap-6 justify-between">
        {/* ── Left ─────────────────────── */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* PO ID + badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#E2E8F0", fontFamily: "'Courier New', monospace" }}>
              PO-{inv.id.slice(-8).toUpperCase()}
            </span>

            {/* Status */}
            {inv.status === "Pending" ? (
              <span className="status-badge status-pending"><Clock size={10} /> Pending</span>
            ) : inv.status === "Ordered" ? (
              <span className="status-badge status-ordered"><Package size={10} /> Ordered</span>
            ) : inv.status === "Received" ? (
              <span className="status-badge status-ok"><CheckCircle size={10} /> Received</span>
            ) : (
              <span className="status-badge" style={{ background: "rgba(100,116,139,0.15)", color: "#64748B" }}>
                <AlertCircle size={10} /> {inv.status}
              </span>
            )}

            {/* Priority */}
            {!isCompleted && (
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                color: isHigh ? "#EF4444" : "#3B82F6",
                background: isHigh ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
                border: `1px solid ${isHigh ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}`,
                padding: "2px 8px", borderRadius: "999px",
              }}>
                {isHigh && <span>⚠ </span>}{inv.priority} Priority
              </span>
            )}
          </div>

          {/* Product info */}
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0", marginBottom: "4px" }}>
              {inv.product_name}
            </p>
            <p style={{ fontSize: "12px", color: "#475569" }}>
              Vendor: <span style={{ color: "#94A3B8" }}>{inv.vendor}</span>
              {" · "}
              Sizes: <span style={{ color: "#94A3B8" }}>{inv.sizes?.join(", ")}</span>
            </p>
          </div>

          {/* AI Justification */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}
          >
            <p className="flex items-center gap-2 mb-2" style={{ fontSize: "11px", fontWeight: 600, color: "rgba(167,139,250,0.9)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <BrainCircuit size={13} />
              AI Recommendation · {inv.generated_by}
            </p>
            <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6, fontStyle: "italic" }}>
              "{inv.ai_justification}"
            </p>
          </div>

          {/* Timestamps */}
          {(inv.approved_at || inv.received_at) && (
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {inv.approved_at && (
                <p style={{ fontSize: "11px", color: "#475569" }}>
                  Approved: <span style={{ color: "#94A3B8" }}>{new Date(inv.approved_at).toLocaleString()}</span>
                </p>
              )}
              {inv.received_at && (
                <p style={{ fontSize: "11px", color: "#22C55E" }}>
                  ✓ Received & Restocked: <span>{new Date(inv.received_at).toLocaleString()}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Right ────────────────────── */}
        <div className="flex flex-col items-end justify-between gap-4" style={{ minWidth: "180px", flexShrink: 0 }}>
          <div className="text-right">
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              Estimated Cost
            </p>
            <p style={{ fontSize: "26px", fontWeight: 800, color: "#E2E8F0", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              ₹{inv.estimated_cost?.toLocaleString()}
            </p>
            <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
              {inv.quantity} units to order
            </p>
          </div>

          {/* CTA */}
          <div className="w-full">
            {inv.status === "Pending" && (
              <button
                onClick={() => onUpdate(inv.id, "Ordered")}
                disabled={isUpdating}
                className="btn-primary w-full"
                style={{ justifyContent: "center", padding: "10px 16px", opacity: isUpdating ? 0.6 : 1 }}
              >
                {isUpdating ? <RefreshCw size={14} className="spin" /> : <CheckCircle size={14} />}
                {isUpdating ? "Updating..." : "Approve & Order"}
              </button>
            )}
            {inv.status === "Ordered" && (
              <button
                onClick={() => onUpdate(inv.id, "Received")}
                disabled={isUpdating}
                className="btn-primary w-full"
                style={{ background: "#16A34A", justifyContent: "center", padding: "10px 16px", opacity: isUpdating ? 0.6 : 1 }}
              >
                {isUpdating ? <RefreshCw size={14} className="spin" /> : <Package size={14} />}
                {isUpdating ? "Updating inventory..." : "Mark as Received"}
              </button>
            )}
            {inv.status === "Received" && (
              <div>
                <p className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "#22C55E", fontWeight: 600 }}>
                  <CheckCircle size={14} /> Inventory Updated
                </p>
                <p style={{ fontSize: "11px", color: "#475569", marginTop: "3px" }}>
                  +{inv.quantity} units added to stock
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "11px", color: "#334155", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        Generated {new Date(inv.created_at).toLocaleString()}
      </p>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div style={{ fontSize: "13px", color: "#475569" }}>Loading purchase orders...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
