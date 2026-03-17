import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { LayoutDashboard, FileText, Package2, TicketCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "TechnoSport Vendor Hub",
  description: "Inventory & AI-Powered Purchase Order Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen" style={{ background: "#0F172A" }}>

        {/* ── Sidebar ───────────────────────────────── */}
        <aside
          className="flex flex-col flex-shrink-0"
          style={{
            width: "220px",
            background: "#020617",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Brand */}
          <div className="p-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5 mb-1">
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Package2 size={15} className="text-white" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em" }}>
                  Vendor Hub
                </p>
              </div>
            </div>
            <p style={{ fontSize: "10px", color: "#334155", fontWeight: 500, paddingLeft: "40px" }}>
              TechnoSport · Internal
            </p>
          </div>

          {/* Nav section */}
          <nav className="flex-1 p-3 pt-4">
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: "12px", marginBottom: "6px" }}>
              Management
            </p>
            <div className="space-y-1">
              <Link href="/" className="sidebar-nav-item">
                <LayoutDashboard size={15} />
                Inventory
              </Link>
              <Link href="/invoices" className="sidebar-nav-item">
                <FileText size={15} />
                Purchase Orders
              </Link>
              <Link href="/tickets" className="sidebar-nav-item">
                <TicketCheck size={15} />
                Support Tickets
              </Link>
            </div>
          </nav>

          {/* User footer */}
          <div className="p-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                JD
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>John Doe</p>
                <p style={{ fontSize: "11px", color: "#475569" }}>Supply Chain Mgr</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ──────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header
            style={{
              height: "56px",
              background: "rgba(15,23,42,0.9)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
            }}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: "6px", height: "6px", background: "#22C55E", borderRadius: "50%" }} />
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}>
                All systems operational
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#334155" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto p-7">
            {children}
          </div>
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E293B",
              color: "#E2E8F0",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: "10px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
