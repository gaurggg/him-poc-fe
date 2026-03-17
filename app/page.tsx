"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import { Search, X, ChevronDown, Truck, RotateCcw, ShieldCheck } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://technosportpocapi.atinity.com/";

const CATEGORIES = ["All", "Men", "Women", "Boys"];
const SORTS = [
  { label: "Name A–Z",        value: "name",   order: "asc"  },
  { label: "Price: Low–High", value: "price",  order: "asc"  },
  { label: "Price: High–Low", value: "price",  order: "desc" },
  { label: "Top Rated",       value: "rating", order: "desc" },
];

const TRUST_BADGES = [
  { icon: Truck,       label: "Free Delivery",   sub: "On orders above ₹499" },
  { icon: RotateCcw,   label: "7-Day Returns",   sub: "Hassle-free returns" },
  { icon: ShieldCheck, label: "Quality Assured",  sub: "100% genuine products" },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState(SORTS[0]);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchProducts, 300);
  }, [search, category, sort]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params: any = { sort_by: sort.value, order: sort.order };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const res = await axios.get(`${API}/products`, { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <div
        className="fade-up-1"
        style={{
          background: "linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 40%, #F8FAFC 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between"
            style={{ minHeight: "240px", paddingTop: "32px", paddingBottom: "32px" }}
          >
            {/* ── Left: Text ─────────────────────────── */}
            <div style={{ flex: "0 0 auto", maxWidth: "480px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6366F1",
                  background: "rgba(99,102,241,0.1)",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  marginBottom: "16px",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                New Season · 2025
              </span>
              <h1
                style={{
                  fontSize: "clamp(26px, 3.5vw, 42px)",
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.18,
                  letterSpacing: "-0.025em",
                  marginBottom: "14px",
                }}
              >
                Premium Sportswear
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366F1, #818CF8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Built to Perform
                </span>
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                  maxWidth: "380px",
                }}
              >
                Cutting-edge fabric technology engineered for champions.
                Shop the latest collection for Men, Women &amp; Kids.
              </p>

              {/* CTA + stat */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #6366F1, #818CF8)",
                    color: "white",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(99,102,241,0.35)",
                    transition: "transform 0.18s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  Shop Now
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ display: "flex" }}>
                    {["#F1F5F9", "#E2E8F0", "#CBD5E1"].map((bg, i) => (
                      <div
                        key={i}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          background: bg,
                          border: "2px solid white",
                          marginLeft: i > 0 ? "-8px" : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#64748B",
                        }}
                      >
                        {["M", "W", "K"][i]}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 500 }}>
                    10k+ happy customers
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right: Visual product cards ─────── */}
            <div
              className="hidden lg:flex items-center"
              style={{ flex: 1, justifyContent: "flex-end", paddingLeft: "40px", position: "relative", height: "220px" }}
            >
              {/* Large feature card */}
              <div
                style={{
                  position: "absolute",
                  right: "160px",
                  top: "0",
                  width: "150px",
                  height: "190px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 16px 40px rgba(99,102,241,0.18)",
                  border: "3px solid white",
                  zIndex: 3,
                  transform: "rotate(-3deg)",
                  background: "#E0E7FF",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&auto=format&fit=crop"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              {/* Middle card */}
              <div
                style={{
                  position: "absolute",
                  right: "60px",
                  top: "15px",
                  width: "130px",
                  height: "170px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  border: "3px solid white",
                  zIndex: 2,
                  transform: "rotate(2deg)",
                  background: "#FEF3C7",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&auto=format&fit=crop"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              {/* Right card */}
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "20px",
                  width: "100px",
                  height: "140px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  border: "3px solid white",
                  zIndex: 1,
                  transform: "rotate(-1deg)",
                  background: "#DCFCE7",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&auto=format&fit=crop"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              {/* Decorative floating badge */}
              <div
                style={{
                  position: "absolute",
                  left: "40px",
                  bottom: "0",
                  background: "white",
                  borderRadius: "12px",
                  padding: "10px 16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366F1, #818CF8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>200+ Styles</p>
                  <p style={{ fontSize: "11px", color: "#64748B" }}>New arrivals weekly</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Trust badges ────────────────────── */}
          <div
            className="flex items-center gap-6 overflow-x-auto pb-4"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "14px" }}
          >
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <Icon size={16} style={{ color: "#6366F1", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                    {label}
                  </p>
                  <p style={{ fontSize: "10px", color: "#94A3B8" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FILTER BAR ══════════════════════════════════════════ */}
      <div
        className="sticky top-[60px] z-40 fade-up-2"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2.5 flex-wrap">

            {/* ── Category pills ────────────────── */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cat-pill${category === cat ? " active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div
              className="hidden sm:block flex-shrink-0"
              style={{ width: "1px", height: "26px", background: "rgba(0,0,0,0.08)" }}
            />

            {/* ── Search ────────────────────────── */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#94A3B8" }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: "34px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13px" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#94A3B8" }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* ── Sort ──────────────────────────── */}
            <div className="relative flex-shrink-0">
              <select
                value={`${sort.value}:${sort.order}`}
                onChange={(e) => {
                  const [value, order] = e.target.value.split(":");
                  setSort(SORTS.find((s) => s.value === value && s.order === order) || SORTS[0]);
                }}
                className="input-field appearance-none pr-8"
                style={{
                  width: "auto",
                  minWidth: "145px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {SORTS.map((s) => (
                  <option key={`${s.value}:${s.order}`} value={`${s.value}:${s.order}`}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#94A3B8" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══ PRODUCT SECTION ══════════════════════════════════════ */}
      <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 fade-up-3">
        {/* Results count */}
        <p className="mb-4" style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>
          {loading
            ? "Loading..."
            : `Showing ${total} product${total !== 1 ? "s" : ""}${category !== "All" ? ` in ${category}` : ""}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border"
                style={{ height: "310px", background: "#F1F5F9", borderColor: "#E2E8F0" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "#F1F5F9" }}
            >
              <Search size={24} style={{ color: "#94A3B8" }} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
              No products found
            </p>
            <p style={{ fontSize: "13px", color: "#94A3B8" }}>
              Try a different search term or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center h-96"
          style={{ color: "#94A3B8", fontSize: "14px" }}
        >
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
