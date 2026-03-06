"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import NavBar from "../../components/NavBar";
import { apiGet } from "../../lib/apiClient";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiGet("/reports/overview").then(setOverview).catch((e) => setError(e.message));
  }, []);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <NavBar />
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mb-8 text-sm text-[#86868b]">Your spending at a glance.</p>
        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        {!overview ? <p className="text-sm text-[#86868b]">Loading...</p> : (
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="card"><p className="text-xs uppercase text-[#86868b]">Total Expenses</p><p className="text-3xl font-semibold">${overview.totals.expenses.toFixed(2)}</p></div>
            <div className="card"><p className="text-xs uppercase text-[#86868b]">Total Income</p><p className="text-3xl font-semibold text-[#34c759]">${overview.totals.income.toFixed(2)}</p></div>
            <div className="card"><p className="text-xs uppercase text-[#86868b]">Net Cash Flow</p><p className="text-3xl font-semibold">${overview.totals.netCashFlow.toFixed(2)}</p></div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
