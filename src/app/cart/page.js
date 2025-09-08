"use client";

import React, { useEffect, useState } from "react";
import { readCart, writeCart } from "../../../utils/cart";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(readCart());
  }, []);

  const save = (next) => {
    setCart(next);
    writeCart(next);
  };

  const inc = (id) => {
    const next = cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
    save(next);
  };

  const dec = (id) => {
    const next = cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c));
    save(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((c) => c.id !== id);
    save(next);
  };

  const clearCart = () => save([]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Cart Summary</h2>
        <div>
          <Link href="/" className="btn btn-outline-secondary">Back to products</Link>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="row">
          <div className="col-12 col-md-8">
            <ul className="list-group">
              {cart.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center" style={{ gap: 12 }}>
                    <img src={c.image} alt={c.title} style={{ height: 60, width: 60, objectFit: "contain" }} />
                    <div>
                      <div className="fw-semibold">{c.title}</div>
                      <div className="text-muted small">Price: ${c.price}</div>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => dec(c.id)}>-</button>
                        <span className="mx-2">{c.qty}</span>
                        <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => inc(c.id)}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <div>${(c.price * c.qty).toFixed(2)}</div>
                    <div className="mt-1">
                      <button className="btn btn-link btn-sm text-danger" onClick={() => removeItem(c.id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <button className="btn btn-danger" onClick={clearCart}>Clear cart</button>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Order summary</h5>
              <div className="d-flex justify-content-between mt-2">
                <div>Items</div>
                <div>{cart.reduce((s, i) => s + i.qty, 0)}</div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <strong>Total</strong>
                <strong>${total}</strong>
              </div>

              <button className="btn btn-primary w-100 mt-3">Proceed to checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
