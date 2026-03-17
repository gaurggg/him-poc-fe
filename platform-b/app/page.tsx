"use client";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { AlertTriangle, CheckCircle, PackageSearch, RefreshCw, Bot, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function InventoryContent() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, low_stock: 0 });
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API}/inventory`);
      setInventory(res.data.inventory);
      setStats({ total: res.data.total, low_stock: res.data.low_stock_count });
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const runAIAgent = async () => {
    if (stats.low_stock === 0) {
      toast.success("Inventory is healthy — no restocking needed.");
      return;
    }
    setRunningAgent(true);
    try {
      const res = await axios.post(`${API}/agent/run`);
      toast.success(res.data.message, { duration: 5000 });
      setTimeout(() => { window.location.href = "/invoices"; }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "AI Agent failed to run");
    } finally {
      setRunningAgent(false);
    }
  };

  const simulateSale = async (product_id: string, size: string, currentQty: number) => {
    if (currentQty <= 0) return;
    try {
      await axios.patch(`${API}/inventory/${product_id}/${size}?quantity=${Math.max(0, currentQty - 5)}`);
      fetchInventory();
      toast.success("Simulated 5 units sold");
    } catch {
      toast.error("Failed to update stock");
    }
  };

  if (loading)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-28 rounded-xl" style={{ background: "#1E293B" }} />
          ))}
        </div>
        <div className="animate-pulse h-64 rounded-xl" style={{ background: "#1E293B" }} />
      </div>
    );

  const healthyPct = stats.total > 0 ? Math.round(((stats.total - stats.low_stock) / stats.total) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────── */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em", marginBottom: "4px" }}>
            Live Inventory
          </h1>
          <p style={{ fontSize: "13px", color: "#475569" }}>
            Monitoring {stats.total} SKUs across all size variants
          </p>
        </div>
        <button
          onClick={runAIAgent}
          disabled={runningAgent}
          className="btn-primary"
          style={{
            background: runningAgent ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #8B5CF6, #3B82F6)",
            padding: "10px 18px",
            fontSize: "13px",
          }}
        >
          {runningAgent ? (
            <>
              <RefreshCw size={15} className="spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Bot size={15} />
              Run AI Agent
            </>
          )}
        </button>
      </div>

      {/* ── Stat cards ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in-1">
        {/* Total SKUs */}
        <div className="stat-card stat-card-blue">
          <div className="flex items-start justify-between mb-3">
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Total SKUs
            </p>
            <PackageSearch size={16} style={{ color: "#3B82F6", opacity: 0.6 }} />
          </div>
          <p style={{ fontSize: "34px", fontWeight: 800, color: "#E2E8F0", lineHeight: 1, marginBottom: "8px", fontVariantNumeric: "tabular-nums" }}>
            {stats.total}
          </p>
          {/* Progress bar */}
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ width: `${healthyPct}%`, height: "4px", background: "#3B82F6", borderRadius: "2px", transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>
            {healthyPct}% healthy stock
          </p>
        </div>

        {/* Low Stock */}
        <div className={`stat-card ${stats.low_stock > 0 ? "stat-card-red" : "stat-card-green"}`}>
          <div className="flex items-start justify-between mb-3">
            <p style={{ fontSize: "11px", fontWeight: 600, color: stats.low_stock > 0 ? "#EF4444" : "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Low Stock
            </p>
            <AlertTriangle size={16} style={{ color: stats.low_stock > 0 ? "#EF4444" : "#475569", opacity: 0.7 }} />
          </div>
          <p style={{ fontSize: "34px", fontWeight: 800, color: stats.low_stock > 0 ? "#EF4444" : "#E2E8F0", lineHeight: 1, marginBottom: "8px", fontVariantNumeric: "tabular-nums" }}>
            {stats.low_stock}
          </p>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ width: stats.total > 0 ? `${(stats.low_stock / stats.total) * 100}%` : "0%", height: "4px", background: stats.low_stock > 0 ? "#EF4444" : "#22C55E", borderRadius: "2px", transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>
            {stats.low_stock > 0 ? "Action required" : "All clear"}
          </p>
        </div>

        {/* Healthy */}
        <div className="stat-card stat-card-green">
          <div className="flex items-start justify-between mb-3">
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Healthy
            </p>
            <CheckCircle size={16} style={{ color: "#22C55E", opacity: 0.6 }} />
          </div>
          <p style={{ fontSize: "34px", fontWeight: 800, color: "#22C55E", lineHeight: 1, marginBottom: "8px", fontVariantNumeric: "tabular-nums" }}>
            {stats.total - stats.low_stock}
          </p>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ width: `${healthyPct}%`, height: "4px", background: "#22C55E", borderRadius: "2px", transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>
            Above threshold
          </p>
        </div>
      </div>

      {/* ── Inventory Table ───────────────────────── */}
      <div className="fade-in-2">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0" }}>
            Stock Levels
          </h2>
          <button
            onClick={fetchInventory}
            style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "5px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Vendor</th>
                <th>In Stock</th>
                <th>Threshold</th>
                <th>Last Restocked</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={i}>
                  {/* Product */}
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt=""
                        style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover", background: "#263349", flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0", marginBottom: "2px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.product_name}
                        </p>
                        <p style={{ fontSize: "11px", color: "#475569" }}>{item.category}</p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td>
                    <span style={{ fontSize: "11px", fontFamily: "'Courier New', monospace", fontWeight: 600, color: "#94A3B8", background: "rgba(255,255,255,0.05)", padding: "3px 7px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {item.product_id.slice(-6).toUpperCase()}-{item.size}
                    </span>
                  </td>

                  {/* Vendor */}
                  <td style={{ color: "#94A3B8", fontSize: "12px" }}>{item.vendor}</td>

                  {/* Qty */}
                  <td>
                    <span style={{ fontSize: "15px", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: item.is_low_stock ? "#EF4444" : "#E2E8F0" }}>
                      {item.quantity}
                    </span>
                  </td>

                  {/* Threshold */}
                  <td style={{ color: "#475569", fontSize: "12px", fontVariantNumeric: "tabular-nums" }}>
                    {item.threshold}
                  </td>

                  {/* Last Restocked */}
                  <td style={{ fontSize: "11px", color: "#334155" }}>
                    {item.last_restocked_at
                      ? <span style={{ color: "#22C55E" }}>{new Date(item.last_restocked_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                      : <span style={{ color: "#1E293B" }}>—</span>
                    }
                  </td>

                  {/* Status */}
                  <td>
                    {item.is_low_stock ? (
                      <span className="status-badge status-low">
                        <AlertTriangle size={10} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="status-badge status-ok">
                        <CheckCircle size={10} />
                        Healthy
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td>
                    <button
                      onClick={() => simulateSale(item.product_id, item.size, item.quantity)}
                      disabled={item.quantity === 0}
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "5px 10px",
                        borderRadius: "6px",
                        background: "rgba(239,68,68,0.08)",
                        color: "rgba(239,68,68,0.75)",
                        border: "1px solid rgba(239,68,68,0.15)",
                        cursor: item.quantity === 0 ? "not-allowed" : "pointer",
                        opacity: item.quantity === 0 ? 0.4 : 1,
                        transition: "all 0.15s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onMouseEnter={(e) => { if (item.quantity > 0) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)"; }}}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
                    >
                      <TrendingDown size={11} /> −5 Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div style={{ fontSize: "13px", color: "#475569" }}>Loading inventory...</div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
