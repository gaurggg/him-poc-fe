"use client";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const CATEGORIES = [
  { label: "Men",   href: "/?category=Men" },
  { label: "Women", href: "/?category=Women" },
  { label: "Boys",  href: "/?category=Boys" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] gap-4">

          {/* ── Logo ──────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #6366F1, #818CF8)",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "17px",
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.01em",
              }}
            >
              Techno<span style={{ color: "#6366F1" }}>Sport</span>
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────── */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {CATEGORIES.map((c) => (
              <Link key={c.label} href={c.href} className="nav-item">
                {c.label}
              </Link>
            ))}
            <div
              style={{
                width: "1px",
                height: "18px",
                background: "rgba(0,0,0,0.1)",
                margin: "0 4px",
              }}
            />
            <Link href="/orders" className="nav-item">
              My Orders
            </Link>
          </div>

          {/* ── Right: Cart + mobile toggle ─────── */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              <ShoppingCart size={20} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white"
                  style={{
                    background: "#6366F1",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "0 4px",
                  }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ color: "#64748B" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────── */}
        {menuOpen && (
          <div
            className="md:hidden pb-4 pt-3 flex flex-col gap-1"
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            {[...CATEGORIES, { label: "My Orders", href: "/orders" }].map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#64748B" }}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
              >
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
