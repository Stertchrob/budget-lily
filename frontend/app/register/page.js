"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import BrandLogo from "../../components/BrandLogo";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) return setError(signUpError.message);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <BrandLogo size={72} />
          <p className="text-xl font-semibold text-[#1d1d1f]">Budget Lily</p>
        </div>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mb-8 text-sm text-[#86868b]">Start tracking your spending.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error ? <p className="text-sm text-[#ff3b30]">{error}</p> : null}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Creating..." : "Create account"}</button>
        </form>
        <div className="mt-6 text-sm">
          <Link href="/login" className="text-[#0071e3]">Already have an account? Sign in</Link>
        </div>
      </div>
    </main>
  );
}
