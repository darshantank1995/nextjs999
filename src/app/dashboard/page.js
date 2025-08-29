"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "../../../utils/checkAuth"; // adjust path

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isValid = checkAuth(router);
    if (isValid) {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="p-4">Checking authentication...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3">Dashboard</h1>
      <p>You are logged in 🎉</p>
    </div>
  );
}
