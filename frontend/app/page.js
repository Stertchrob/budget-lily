"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [loading, router, user]);

  return <div className="flex min-h-screen items-center justify-center text-[#86868b]">Loading...</div>;
}
