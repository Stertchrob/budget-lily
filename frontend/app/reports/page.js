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
      <main className="mx-auto max-w-7xl px-6 pb-16">
        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        {!data ? <p className="text-sm text-[#86868b]">Loading...</p> : (
          <>
            <ReportsCharts categoryData={data.byCategoryAverage || []} trendData={data.trend || []} averages={data.averages} />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Top merchants</h2>
                  <p className="mt-1 text-sm text-[#6e6e73]">Total spend with each merchant across the selected window.</p>
                </div>
                <ul className="space-y-3">
                  {(data.topMerchants || []).map((m, i) => (
                    <li key={m.name} className="flex items-center justify-between gap-4 rounded-3xl bg-[#f5f5f7] px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-medium text-[#86868b] shadow-sm">{i + 1}</span>
                        <span className="truncate">{m.name}</span>
                      </span>
                      <span className="font-medium tabular-nums">${m.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Recurring charges</h2>
                  <p className="mt-1 text-sm text-[#6e6e73]">Charges that repeated across multiple months, ranked by average spend in active months.</p>
                </div>
                <ul className="space-y-3">
                  {(data.recurringCharges || []).map((m) => (
                    <li key={m.merchant} className="flex items-center justify-between gap-4 rounded-3xl bg-[#f5f5f7] px-4 py-3">
                      <span className="truncate font-medium text-[#1d1d1f]">{m.merchant}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-right text-sm tabular-nums text-[#6e6e73] shadow-sm">
                        {m.activeMonths} mo · ${m.averageMonthlySpend.toFixed(2)}/mo
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
