"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  return (
    <div className="container py-4">
      <h1 className="mb-3">Dashboard</h1>
      <p>You are logged in 🎉</p>
    </div>
  );
}
