"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = not checked yet
  const pathname = usePathname();

  const checkAuth = () => {
    try {
      const raw = Cookies.get("auth");
      const auth = raw ? JSON.parse(raw) : null;
      const ok = auth?.accessToken;
      setIsLoggedIn(ok);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

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
    Cookies.remove("auth");
    window.location.href = "/login";
  };

  // 👉 Don’t render nav items until we know login state
  if (isLoggedIn === null) {
    return null; // or return a skeleton loader/spinner
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">

          <Link  className="navbar-brand" href="/" >Navbar</Link>

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
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link href="/dashboard" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link href="/todo" className="nav-link">Todo</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}

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
          </ul>
        </div>
      </div>
    </nav>
  );
}
