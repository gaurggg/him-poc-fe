"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Star, Paperclip, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://technosportpocapi.atinity.com").replace(/^http:\/\//, "https://");

interface Message {
  from: "user" | "bot";
  text: string;
  action?: string;
  time?: string;
}

const QUICK_REPLIES = [
  "Track my order",
  "Return policy",
  "Size guide",
  "Shipping info",
];

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function generateSessionId() {
  return "sess-" + Math.random().toString(36).slice(2, 10);
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sessionIdRef = useRef<string>(generateSessionId());
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "👋 Hi! I'm TechnoSport's friendly assistant!\n\nI can help you with orders, returns, shipping, sizing and more.",
      time: getTime(),
    },
    {
      from: "bot",
      text: "What can I help you with today?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ order_id: "", rating: 5, comment: "" });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Only show on home and product pages — not on orders/cart
  if (pathname === "/orders" || pathname === "/cart") return null;

  const sendMessage = async (text: string) => {
    const userMsg = text.trim();
    if (!userMsg || loading) return;
    setInput("");
    setShowQuickReplies(false);
    setMessages((m) => [...m, { from: "user", text: userMsg, time: getTime() }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chatbot`, {
        message: userMsg,
        session_id: sessionIdRef.current,
      });
      const data = res.data;
      setMessages((m) => [
        ...m,
        { from: "bot", text: data.reply, action: data.action, time: getTime() },
      ]);
      if (data.action === "open_feedback_form") {
        setTimeout(() => setShowFeedback(true), 500);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Sorry, something went wrong. Please try again.", time: getTime() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.comment) {
      toast.error("Please write your feedback");
      return;
    }
    try {
      await axios.post(`${API}/feedback`, {
        order_id: feedback.order_id || undefined,
        customer_name: "Customer",
        customer_email: "",
        rating: feedback.rating,
        comment: feedback.comment,
      });
      setShowFeedback(false);
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: `✅ Thank you for your ${feedback.rating}-star feedback! Our team will follow up shortly.`,
          time: getTime(),
        },
      ]);
      toast.success("Feedback submitted!");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <>
      {/* ── Floating button ───────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4F46E5, #6366F1)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        className={!open ? "chat-btn-pulse" : ""}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        aria-label="Open support chat"
      >
        {open ? (
          <X size={22} color="white" />
        ) : (
          <ShoppingBag size={22} color="white" />
        )}
      </button>

      {/* ── Chat window ───────────────────────── */}
      {open && (
        <div
          className="chat-window-enter"
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            zIndex: 50,
            width: "360px",
            height: "540px",
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)",
            background: "white",
          }}
        >
          {/* ── Header ──────────────────── */}
          <div
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              padding: "16px 16px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: "2.5px solid rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShoppingBag size={20} color="white" />
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    color: "white",
                    fontSize: "15px",
                    lineHeight: 1.2,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  TechnoSport
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.85)",
                    marginTop: "2px",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      background: "#4ADE80",
                      borderRadius: "50%",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  Your Shopping Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={16} color="white" />
            </button>
          </div>

          {/* ── Messages ────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              background: "#F8FAFC",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {/* Today separator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  background: "#E5E7EB",
                  padding: "3px 14px",
                  borderRadius: "999px",
                  fontWeight: 500,
                }}
              >
                Today
              </span>
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                {/* Bot avatar */}
                {msg.from === "bot" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4F46E5, #6366F1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShoppingBag size={12} color="white" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: "78%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.from === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: msg.from === "user" ? "#6366F1" : "white",
                      color: msg.from === "user" ? "white" : "#1F2937",
                      padding: "10px 13px",
                      borderRadius:
                        msg.from === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      fontSize: "13px",
                      lineHeight: 1.55,
                      boxShadow:
                        msg.from === "bot"
                          ? "0 1px 4px rgba(0,0,0,0.08)"
                          : "none",
                    }}
                  >
                    <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                  </div>
                  {msg.time && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#9CA3AF",
                        marginTop: "3px",
                        paddingLeft: msg.from === "bot" ? "2px" : "0",
                        paddingRight: msg.from === "user" ? "2px" : "0",
                      }}
                    >
                      {msg.time}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick replies — 2×2 grid */}
            {showQuickReplies && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "6px",
                  paddingLeft: "36px",
                }}
              >
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "10px",
                      border: "1.5px solid #E5E7EB",
                      background: "white",
                      color: "#374151",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      lineHeight: 1.3,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#6366F1";
                      (e.currentTarget as HTMLButtonElement).style.color = "#4F46E5";
                      (e.currentTarget as HTMLButtonElement).style.background = "#EEF2FF";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB";
                      (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                      (e.currentTarget as HTMLButtonElement).style.background = "white";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Loading dots */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4F46E5, #6366F1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShoppingBag size={12} color="white" />
                </div>
                <div
                  style={{
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="animate-bounce"
                      style={{
                        width: "6px",
                        height: "6px",
                        background: "#6366F1",
                        borderRadius: "50%",
                        display: "inline-block",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Feedback form ──────────────── */}
          {showFeedback && (
            <div
              style={{
                padding: "14px",
                borderTop: "1px solid #E5E7EB",
                background: "white",
                flexShrink: 0,
              }}
            >
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937", marginBottom: "10px" }}>
                Rate your experience
              </p>
              <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setFeedback({ ...feedback, rating: s })} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
                    <Star
                      size={22}
                      fill={s <= feedback.rating ? "#F59E0B" : "none"}
                      style={{ color: s <= feedback.rating ? "#F59E0B" : "#D1D5DB" }}
                    />
                  </button>
                ))}
              </div>
              <input
                placeholder="Order ID (optional)"
                value={feedback.order_id}
                onChange={(e) => setFeedback({ ...feedback, order_id: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: "12px",
                  marginBottom: "8px",
                  color: "#1F2937",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <textarea
                placeholder="Tell us how we did..."
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: "12px",
                  resize: "none",
                  marginBottom: "8px",
                  color: "#1F2937",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                rows={2}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={submitFeedback}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "8px",
                    background: "#6366F1",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowFeedback(false)}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "8px",
                    background: "white",
                    color: "#6B7280",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1.5px solid #E5E7EB",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Input bar ───────────────── */}
          {!showFeedback && (
            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid #E5E7EB",
                background: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "999px",
                  border: "1.5px solid #E5E7EB",
                  outline: "none",
                  fontSize: "13px",
                  color: "#1F2937",
                  background: "#F9FAFB",
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: input.trim() && !loading ? "#6366F1" : "#E5E7EB",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s ease",
                }}
              >
                <Send size={15} color={input.trim() && !loading ? "white" : "#9CA3AF"} />
              </button>
            </div>
          )}

          {/* ── Footer ──────────────────── */}
          <div
            style={{
              padding: "5px 14px 8px",
              textAlign: "center",
              background: "white",
              borderTop: "1px solid #F3F4F6",
            }}
          >
            <p style={{ fontSize: "10px", color: "#D1D5DB", fontWeight: 500 }}>
              Powered by TechnoSport AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
