"use client";
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  technology: string;
  price: number;
  original_price: number;
  image_url: string;
  rating: number;
  reviews: number;
  sizes: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.sizes[1] || product.sizes[0];
    addItem({
      product_id: product.id,
      name: product.name,
      size: defaultSize,
      quantity: 1,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success(`Added — size ${defaultSize}`, { icon: "🛒" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount =
    product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) * 100
        )
      : 0;

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="product-card group">
        {/* ── Image ─────────────────────────── */}
        <div
          style={{
            height: "172px",
            background: "#F1F5F9",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "10px",
              transition: "transform 0.35s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLImageElement).style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLImageElement).style.transform = "scale(1)")
            }
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format";
            }}
          />

          {/* Discount badge */}
          {discount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "#EF4444",
                color: "white",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "4px",
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {/* ── Info ──────────────────────────── */}
        <div style={{ padding: "10px 10px 10px" }}>
          {/* Tech tag */}
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#6366F1",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "4px",
            }}
          >
            {product.technology}
          </p>

          {/* Name */}
          <h3
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#0F172A",
              lineHeight: 1.45,
              marginBottom: "7px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "35px",
            }}
          >
            {product.name}
          </h3>

          {/* Sizes */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "3px",
              marginBottom: "8px",
            }}
          >
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  padding: "2px 5px",
                  borderRadius: "3px",
                  border: "1px solid #E2E8F0",
                  color: "#64748B",
                  lineHeight: 1.5,
                  background: "#F8FAFC",
                }}
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span style={{ fontSize: "9px", color: "#94A3B8", lineHeight: 1.8 }}>
                +{product.sizes.length - 5}
              </span>
            )}
          </div>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "10px",
            }}
          >
            <Star size={10} fill="#F59E0B" style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: "11px", color: "#64748B" }}>
              {product.rating}
              <span style={{ color: "#CBD5E1" }}> ({product.reviews})</span>
            </span>
          </div>

          {/* Price + ADD */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "6px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ₹{product.price.toLocaleString()}
              </div>
              {product.original_price > product.price && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#94A3B8",
                    textDecoration: "line-through",
                    marginTop: "2px",
                  }}
                >
                  ₹{product.original_price.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: `1.5px solid ${added ? "#10B981" : "#6366F1"}`,
                background: added ? "#10B981" : "transparent",
                color: added ? "white" : "#6366F1",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.18s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!added) {
                  (e.currentTarget as HTMLButtonElement).style.background = "#6366F1";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!added) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6366F1";
                }
              }}
            >
              {added ? "✓ Added" : "+ ADD"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
