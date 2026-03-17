"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingCart, Star, ArrowLeft, Package, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "https://technosportpocapi.atinity.com/";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API}/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        if (r.data.sizes?.length > 0) setSelectedSize(r.data.sizes[1] || r.data.sizes[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <div className="animate-pulse rounded-2xl" style={{ aspectRatio: "1/1", background: "#F1F5F9" }} />
        <div className="space-y-4 pt-4">
          {[260, 140, 100, 80].map((w, i) => (
            <div key={i} className="h-4 rounded-lg animate-pulse" style={{ background: "#F1F5F9", width: `${w}px` }} />
          ))}
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-24">
        <p style={{ fontSize: "14px", color: "#64748B" }}>Product not found.</p>
      </div>
    );

  const stock = product.inventory?.[selectedSize] ?? 0;
  const isLowStock = stock > 0 && stock <= 10;
  const isOutOfStock = stock === 0;
  const discount = Math.round(
    ((product.original_price - product.price) / product.original_price) * 100
  );

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) return;
    setAdding(true);
    addItem({
      product_id: product.id,
      name: product.name,
      size: selectedSize,
      quantity: qty,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success("Added to cart!", { icon: "🛒" });
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 transition-colors"
        style={{ fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
      >
        <ArrowLeft size={15} />
        Back to products
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Image ──────────────────────────────── */}
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "1/1", background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-6"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format";
            }}
          />
          {discount > 0 && (
            <span
              className="absolute top-4 left-4 text-white text-sm font-semibold px-3 py-1 rounded-lg"
              style={{ background: "#6366F1", fontSize: "12px" }}
            >
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* ── Details ────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Category */}
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366F1" }}>
            {product.category} · {product.subcategory}
          </p>

          {/* Name */}
          <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#0F172A", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.floor(product.rating) ? "#F59E0B" : "none"}
                  style={{ color: i < Math.floor(product.rating) ? "#F59E0B" : "#D1D5DB" }}
                />
              ))}
            </div>
            <span style={{ fontSize: "12px", color: "#64748B" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price block */}
          <div
            className="flex items-baseline gap-3 rounded-xl p-4"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <span style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A" }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price > product.price && (
              <span style={{ fontSize: "16px", color: "#94A3B8", textDecoration: "line-through" }}>
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#10B981" }}>
                Save ₹{(product.original_price - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Tech */}
          <div className="flex items-center gap-2">
            <Zap size={13} style={{ color: "#6366F1" }} />
            <span style={{ fontSize: "12px", color: "#64748B" }}>
              Technology:{" "}
              <span style={{ color: "#6366F1", fontWeight: 600 }}>{product.technology}</span>
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.7 }}>{product.description}</p>

          {/* Size picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Select Size
              </p>
              {selectedSize && (
                <p style={{ fontSize: "12px", color: isOutOfStock ? "#EF4444" : isLowStock ? "#F59E0B" : "#10B981" }}>
                  {isOutOfStock ? "Out of stock" : `${stock} units left`}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size: string) => {
                const sizeStock = product.inventory?.[size] ?? 0;
                const oos = sizeStock === 0;
                const sel = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => !oos && setSelectedSize(size)}
                    disabled={oos}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: oos ? "not-allowed" : "pointer",
                      transition: "all 0.15s ease",
                      background: sel ? "#6366F1" : "transparent",
                      border: sel ? "2px solid #6366F1" : oos ? "1.5px solid rgba(0,0,0,0.08)" : "1.5px solid rgba(0,0,0,0.15)",
                      color: sel ? "white" : oos ? "#CBD5E1" : "#475569",
                      textDecoration: oos ? "line-through" : "none",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {isLowStock && (
              <p className="flex items-center gap-1.5 mt-2" style={{ fontSize: "12px", color: "#F59E0B" }}>
                <Package size={12} />
                Only {stock} left — order soon!
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Qty
            </p>
            <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1.5px solid rgba(0,0,0,0.12)" }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width: "38px", height: "38px", color: "#64748B", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                −
              </button>
              <span style={{ width: "38px", textAlign: "center", fontWeight: 700, fontSize: "14px", color: "#0F172A", borderLeft: "1px solid rgba(0,0,0,0.08)", borderRight: "1px solid rgba(0,0,0,0.08)", lineHeight: "38px" }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(stock || 10, qty + 1))}
                style={{ width: "38px", height: "38px", color: "#64748B", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                +
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || !selectedSize || adding}
            className="btn-primary w-full"
            style={{ padding: "14px", fontSize: "14px" }}
          >
            <ShoppingCart size={17} />
            {isOutOfStock ? "Out of Stock" : adding ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
