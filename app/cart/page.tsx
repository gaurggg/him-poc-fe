"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://technosportpocapi.atinity.com").replace(/^http:\/\//, "https://");

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleOrder = async () => {
    if (items.length === 0) return;
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setPlacing(true);
    try {
      const res = await axios.post(`${API}/orders`, {
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
        })),
        customer_name: form.name,
        customer_email: form.email,
      });
      clearCart();
      toast.success(`Order placed! ID: ${res.data.order_id}`, { duration: 5000, icon: "🎉" });
      router.push(`/orders?highlight=${res.data.order_id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "#F1F5F9" }}
        >
          <ShoppingBag size={32} style={{ color: "#94A3B8" }} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
          Your cart is empty
        </h2>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          Add some performance gear to get started!
        </p>
        <Link href="/" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0F172A", marginBottom: "24px", letterSpacing: "-0.01em" }}>
        Shopping Cart
        <span style={{ color: "#6366F1", fontSize: "18px", marginLeft: "8px" }}>({totalItems})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Cart items ──────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.size}`}
              className="flex gap-4 items-center p-4 rounded-2xl"
              style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="rounded-xl object-contain flex-shrink-0"
                style={{ width: "72px", height: "72px", background: "#F8FAFC" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format";
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.35, marginBottom: "3px" }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#6366F1" }}>
                  Size: {item.size}
                </p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginTop: "4px" }}>
                  ₹{item.price.toLocaleString()}
                </p>
              </div>
              {/* Qty controls */}
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.12)" }}>
                <button
                  onClick={() => updateQty(item.product_id, item.size, item.quantity - 1)}
                  style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
                >
                  <Minus size={13} />
                </button>
                <span style={{ width: "32px", textAlign: "center", fontWeight: 700, fontSize: "13px", color: "#0F172A", borderLeft: "1px solid rgba(0,0,0,0.08)", borderRight: "1px solid rgba(0,0,0,0.08)", lineHeight: "32px" }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.product_id, item.size, item.quantity + 1)}
                  style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
                >
                  <Plus size={13} />
                </button>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item.product_id, item.size)}
                  style={{ color: "#CBD5E1" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ───────────────── */}
        <div
          className="h-fit rounded-2xl p-6 space-y-5"
          style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>Order Summary</h2>

          <div className="space-y-3 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#64748B" }}>Subtotal ({totalItems} items)</span>
              <span style={{ color: "#0F172A", fontWeight: 600 }}>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#64748B" }}>Shipping</span>
              <span style={{ color: shipping === 0 ? "#10B981" : "#0F172A", fontWeight: 600 }}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>
            {totalPrice < 999 && (
              <p style={{ fontSize: "11px", color: "#94A3B8" }}>
                Add ₹{999 - totalPrice} more for free shipping
              </p>
            )}
          </div>

          <div className="flex justify-between items-baseline">
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#64748B" }}>Total</span>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A" }}>
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              style={{ fontSize: "13px" }}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              style={{ fontSize: "13px" }}
            />
          </div>

          <button
            onClick={handleOrder}
            disabled={placing}
            className="btn-primary w-full"
            style={{ padding: "13px" }}
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
          <p style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center" }}>
            No payment required for this demo
          </p>
        </div>
      </div>
    </div>
  );
}
