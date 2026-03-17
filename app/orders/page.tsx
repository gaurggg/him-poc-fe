"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Package, CheckCircle, Truck, Clock } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://technosportpocapi.atinity.com";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Confirmed:  { color: "#6366F1", bg: "rgba(99,102,241,0.1)",   icon: <CheckCircle size={12} /> },
  Processing: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   icon: <Clock size={12} /> },
  Shipped:    { color: "#8B5CF6", bg: "rgba(139,92,246,0.1)",   icon: <Truck size={12} /> },
  Delivered:  { color: "#10B981", bg: "rgba(16,185,129,0.1)",   icon: <CheckCircle size={12} /> },
  Cancelled:  { color: "#EF4444", bg: "rgba(239,68,68,0.1)",    icon: <Package size={12} /> },
};

function OrdersContent() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/orders`)
      .then((r) => setOrders(r.data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl h-32" style={{ background: "#F1F5F9" }} />
        ))}
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 mx-auto" style={{ background: "#F1F5F9" }}>
          <Package size={32} style={{ color: "#94A3B8" }} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
          No orders yet
        </h2>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          Start shopping to place your first order!
        </p>
        <Link href="/" className="btn-primary">Shop Now</Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0F172A", marginBottom: "24px", letterSpacing: "-0.01em" }}>
        My Orders
      </h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Confirmed"];
          const isNew = order.order_id === highlight;
          return (
            <div
              key={order.id}
              className="rounded-2xl p-5"
              style={{
                background: "#FFFFFF",
                border: `1px solid ${isNew ? "rgba(99,102,241,0.35)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isNew ? "0 0 20px rgba(99,102,241,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                      {order.order_id}
                    </h3>
                    {isNew && (
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "white", background: "#6366F1", padding: "2px 8px", borderRadius: "6px" }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "#94A3B8" }}>
                    {order.created_at?.slice(0, 10)} · {order.customer_name}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 600 }}
                >
                  {cfg.icon}
                  {order.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: "#64748B" }}>
                      {item.name}
                      <span style={{ color: "#94A3B8" }}> ({item.size})</span> × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>Order Total</span>
                <span style={{ fontSize: "17px", fontWeight: 800, color: "#0F172A" }}>
                  ₹{order.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20" style={{ fontSize: "14px", color: "#64748B" }}>
          Loading orders...
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
