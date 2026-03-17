import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ChatbotWidget from "@/components/ChatbotWidget";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Technosport — Performance Active Sportswear",
  description: "Shop premium performance sportswear — T-shirts, shorts, trackpants & more for Men, Women and Boys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <ChatbotWidget />
        </CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0F1628",
              color: "#F1F5F9",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
