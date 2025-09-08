"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { readCart, writeCart } from "../../utils/cart";

// NOTE: Ensure Bootstrap CSS is loaded globally, e.g. in app/layout.jsx:
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(readCart().reduce((s, i) => s + i.qty, 0));
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => (mounted = false);
  }, []);

const addToCart = (product) => {
  // Check login by looking for cookie
  const isLoggedIn = document.cookie.includes("auth=");

  if (!isLoggedIn) {
    // redirect to /login if not logged in
    window.location.href = "/login";
    return;
  }

  const current = readCart();
  const existing = current.find((p) => p.id === product.id);
  let next;
  if (existing) {
    next = current.map((p) =>
      p.id === product.id ? { ...p, qty: p.qty + 1 } : p
    );
  } else {
    next = [
      ...current,
      { id: product.id, title: product.title, price: product.price, qty: 1, image: product.image },
    ];
  }
  writeCart(next);
  setCartCount(next.reduce((s, i) => s + i.qty, 0));
};

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Products</h2>
        <div>
          <a href="/cart" className="btn btn-outline-primary position-relative">
            View Cart
            <span className="badge bg-danger ms-2">{cartCount}</span>
          </a>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {!loading && !error && (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <Image
                src={p.image}
                alt={p.title}
                width={200}        // required
                height={180}       // required
                className="card-img-top p-3"
                style={{ objectFit: "contain", height: "180px", width: "100%" }}
              />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title" style={{ fontSize: "0.95rem" }}>
                    {p.title}
                  </h6>
                  <p className="mb-1 text-muted small text-truncate">{p.category}</p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="fs-6">${p.price}</strong>
                      <small className="text-muted">⭐ {p.rating?.rate ?? "-"} ({p.rating?.count ?? 0})</small>
                    </div>

                    <div className="d-grid gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => addToCart(p)}>
                        Add to cart
                      </button>
                      <a href={`/product/${p.id}`} className="btn btn-outline-secondary btn-sm">View</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
