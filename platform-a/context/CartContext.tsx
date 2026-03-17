"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface CartItem {
  product_id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size: string) => void;
  updateQty: (product_id: string, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_id === newItem.product_id && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i.product_id === newItem.product_id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((product_id: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product_id === product_id && i.size === size))
    );
  }, []);

  const updateQty = useCallback((product_id: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeItem(product_id, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product_id === product_id && i.size === size ? { ...i, quantity: qty } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
