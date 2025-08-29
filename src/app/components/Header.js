"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const checkAuth = () => {
    try {
      const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
      const auth = raw ? JSON.parse(raw) : null;
      const ok = !!auth?.accessToken && Date.now() < (auth?.expiresAt || 0);
      setIsLoggedIn(ok);
    } catch {
      setIsLoggedIn(false);
    }
  };

  // Check on mount and whenever the route changes
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Listen to focus, storage, and custom "auth-changed"
  useEffect(() => {
    const onFocus = () => checkAuth();
    const onStorage = () => checkAuth();
    const onAuthChanged = () => checkAuth();

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar</a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            {/* Home only if logged in */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link">Home</Link>
              </li>
            )}

            {/* Login/Register only if NOT logged in */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}

            {/* Logout only if logged in */}
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={logout}>
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
