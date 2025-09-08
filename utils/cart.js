// lib/cart.js
// Simple read/write helpers for localStorage cart
export const CART_KEY = "cart";

export function readCart() {
  try {
    const s = localStorage.getItem(CART_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
}
