"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import ReportsCharts from "../../components/ReportsCharts";
import { apiGet } from "../../lib/apiClient";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiGet("/reports/overview").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Reports</h1>
        <p className="mb-8 text-sm text-[#86868b]">Category and merchant breakdowns.</p>
        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        {!data ? <p className="text-sm text-[#86868b]">Loading...</p> : (
          <>
            <ReportsCharts categoryData={data.byCategory || []} trendData={data.trend || []} />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h2 className="mb-3 text-lg font-semibold">Top Merchants</h2>
                <ul className="space-y-2 text-sm">{(data.topMerchants || []).map((m) => <li key={m.name}>{m.name}: ${m.amount.toFixed(2)}</li>)}</ul>
              </div>
              <div className="card">
                <h2 className="mb-3 text-lg font-semibold">Recurring Subscriptions</h2>
                <ul className="space-y-2 text-sm">{(data.recurringSubscriptions || []).map((m) => <li key={m.merchant}>{m.merchant}: {m.count} txns, ${m.monthlySpendEstimate.toFixed(2)}</li>)}</ul>
              </div>
            </div>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
