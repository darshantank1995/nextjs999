"use client";

import React, { useEffect, useState } from "react";
import { readCart, writeCart } from "../../../../utils/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetail({ params }) {
  // In Next.js app router, params is provided to page components when using dynamic route file.
  // If you render this component client-side without params, code also attempts to parse window.location.
  const idFromParams = params?.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let id = idFromParams;
    if (!id && typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts.length && parts[0] === "product") id = parts[1];
    }
    if (!id) {
      setError("No product id provided");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [idFromParams]);

  const addToCart = (product) => {
    const current = readCart();
    const existing = current.find((p) => p.id === product.id);
    let next;
    if (existing) {
      next = current.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      next = [...current, { id: product.id, title: product.title, price: product.price, qty: 1, image: product.image }];
    }
    writeCart(next);
    // Option: navigate to cart or show toast; we'll show a simple alert here
    alert("Added to cart");
  };

  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  if (!product) return null;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-md-5">
          <div className="card p-3">
            <img src={product.image} alt={product.title} style={{ width: "100%", height: 360, objectFit: "contain" }} />
          </div>
        </div>
        <div className="col-12 col-md-7">
          <h3>{product.title}</h3>
          <p className="text-muted">Category: {product.category}</p>
          <h4 className="text-primary">${product.price}</h4>
          <p>{product.description}</p>
          <div className="mb-3">Rating: ⭐ {product.rating?.rate ?? "-"} ({product.rating?.count ?? 0})</div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to cart</button>
            <Link href="/cart" className="btn btn-outline-primary">View Cart</Link>
            <button className="btn btn-outline-secondary" onClick={() => router.back()}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
