"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import SummaryHero from "../../components/SummaryHero";
import { apiGet } from "../../lib/apiClient";

function getDefaultDashboardMonth() {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - 1);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getCurrentMonth() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatMonthLabel(month) {
  if (!month) return "this month";
  const date = new Date(`${month}-01T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "long" });
}

function CategoryTrendsSection({ month, trends }) {
  if (!trends?.length) {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Category trends</h3>
        <p className="mt-2 text-sm text-[#6e6e73]">No category trend data yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Category trends</h3>
        <p className="mt-1 text-sm text-[#6e6e73]">
          See how each category changed in {formatMonthLabel(month)} compared with the previous month.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trends.map((item) => {
          const isIncrease = item.changeAmount > 0;
          const isFlat = item.changeAmount === 0;
          const chipClass = isFlat
            ? "bg-[#f5f5f7] text-[#6e6e73]"
            : isIncrease
              ? "bg-[#fff0ef] text-[#ff3b30]"
              : "bg-[#edf9f0] text-[#248a3d]";
          const changeLabel = item.changePercent === null
            ? (item.currentAmount > 0 ? "New this month" : "No prior spend")
            : `${isIncrease ? "+" : ""}${item.changePercent.toFixed(1)}%`;

          return (
            <div
              key={item.name}
              className="rounded-3xl bg-[#f5f5f7] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">Category</p>
                  <h4 className="mt-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">{item.name}</h4>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}>
                  {changeLabel}
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                {formatCurrency(item.currentAmount)}
              </p>
              <p className="mt-2 text-sm text-[#6e6e73]">
                Previous month: {formatCurrency(item.previousAmount)}
              </p>
              <p className="mt-1 text-sm text-[#6e6e73]">
                {isFlat
                  ? "No change from last month."
                  : `${isIncrease ? "Up" : "Down"} ${formatCurrency(Math.abs(item.changeAmount))} month over month.`}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getDefaultDashboardMonth);

  useEffect(() => {
    setOverview(null);
    setError("");
    apiGet(`/reports/overview?month=${selectedMonth}`)
      .then(setOverview)
      .catch((e) => setError(e.message));
  }, [selectedMonth]);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-6 pb-16">
        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        {!overview ? <p className="text-sm text-[#86868b]">Loading...</p> : (
          <div className="space-y-6">
            <SummaryHero
              totals={overview.totals}
              trendData={overview.trend}
              month={overview.month}
              selectedMonth={selectedMonth}
              maxMonth={getCurrentMonth()}
              onMonthChange={setSelectedMonth}
            />
            <CategoryTrendsSection month={overview.month} trends={overview.categoryTrends || []} />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
