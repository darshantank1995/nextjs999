// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth")?.value; // check cookie
  const { pathname } = req.nextUrl;

  // If no token and user tries to access protected routes → redirect to login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && pathname.startsWith("/todo")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and tries to visit login/register → redirect to dashboard
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // allow request
}

// Apply middleware only to specific routes
export const config = {
  matcher: [
    "/dashboard",        // protect dashboard
    "/login",            // redirect logged in users
    "/register",
    "/todo",
    "/demo",
    "/"        // redirect logged in users
  ],
};
