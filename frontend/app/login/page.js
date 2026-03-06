"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import BrandLogo from "../../components/BrandLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) return setError(signInError.message);
    router.push("/dashboard");
  }

  async function onResetPassword() {
    if (!email) return setError("Enter your email first.");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    setError(resetError ? resetError.message : "Reset email sent.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
        <div className="mb-4 flex justify-center">
          <BrandLogo size={170} className="rounded-xl" />
        </div>
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mb-8 text-center text-sm text-[#86868b]">Sign in to continue.</p>
        <form onSubmit={onSubmit} className="flex flex-col items-center space-y-4">
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full max-w-xs" />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full max-w-xs" />
          {error ? <p className="text-sm text-[#ff3b30]">{error}</p> : null}
          <button disabled={loading} className="btn-primary w-full max-w-xs">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <div className="mx-auto mt-6 flex w-full max-w-xs items-center justify-between text-sm">
          <Link className="text-[#0071e3]" href="/register">Create account</Link>
          <button onClick={onResetPassword} className="text-[#86868b]">Reset password</button>
        </div>
      </div>
    </main>
  );
}
