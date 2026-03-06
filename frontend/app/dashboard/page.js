"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import SummaryHero from "../../components/SummaryHero";
import { apiGet } from "../../lib/apiClient";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiGet("/reports/overview").then(setOverview).catch((e) => setError(e.message));
  }, []);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-6 pb-16">

        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        {!overview ? <p className="text-sm text-[#86868b]">Loading...</p> : (
          <SummaryHero totals={overview.totals} trendData={overview.trend} month={overview.month} />
        )}
      </main>
    </ProtectedRoute>
  );
}
