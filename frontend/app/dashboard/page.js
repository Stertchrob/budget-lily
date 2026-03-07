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

function formatPercent(value) {
  return `${Math.round(Number(value || 0))}%`;
}

function BudgetStatusBar({ items, normalize = false }) {
  const positiveTotal = items.reduce((sum, item) => sum + Math.max(item.percent, 0), 0);

  return (
    <div className="overflow-hidden rounded-full bg-[#eceef3]">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {items.map((item) => {
          const displayPercent = normalize && positiveTotal > 0
            ? (Math.max(item.percent, 0) / positiveTotal) * 100
            : Math.max(Math.min(item.percent, 100), 0);

          return (
            <div
              key={item.key}
              className={item.color}
              style={{ width: `${displayPercent}%` }}
              title={`${item.label}: ${formatPercent(item.percent)}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function BudgetStatusSection({ month, budgetStatus }) {
  const recommended = [
    { key: "needs", label: "Needs", amount: null, percent: 50, color: "bg-[#ff9f0a]" },
    { key: "wants", label: "Wants", amount: null, percent: 30, color: "bg-[#0071e3]" },
    { key: "savings", label: "Savings", amount: null, percent: 20, color: "bg-[#34c759]" },
  ];
  const actual = [
    {
      key: "needs",
      label: "Needs",
      amount: budgetStatus?.needs?.amount || 0,
      percent: budgetStatus?.needs?.percent || 0,
      color: "bg-[#ff9f0a]",
    },
    {
      key: "wants",
      label: "Wants",
      amount: budgetStatus?.wants?.amount || 0,
      percent: budgetStatus?.wants?.percent || 0,
      color: "bg-[#0071e3]",
    },
    {
      key: "savings",
      label: "Savings",
      amount: budgetStatus?.savings?.amount || 0,
      percent: budgetStatus?.savings?.percent || 0,
      color: "bg-[#34c759]",
    },
  ];
  const hasIncome = Number(budgetStatus?.income || 0) > 0;
  const hasNegativeSavings = Number(budgetStatus?.savings?.amount || 0) < 0;

  return (
    <div className="mb-6 rounded-[28px] border border-white/70 bg-[#f8f9fc] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <div className="mb-5">
        <h4 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">Needs, wants, and savings</h4>
        <p className="mt-1 text-sm text-[#6e6e73]">
          Recommended is 50/30/20. Actual uses {formatMonthLabel(month)} income, treats Rent, Mortgage, Utilities, Gas, and Transport as needs, everything else as wants, and savings as what is left over.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl bg-white/80 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-[#1d1d1f]">Recommended</p>
            <p className="text-xs uppercase tracking-[0.12em] text-[#86868b]">50 / 30 / 20</p>
          </div>
          <BudgetStatusBar items={recommended} />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {recommended.map((item) => (
              <div key={item.key} className="rounded-2xl bg-[#f5f5f7] px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <p className="text-sm font-medium text-[#1d1d1f]">{item.label}</p>
                </div>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">{formatPercent(item.percent)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white/80 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#1d1d1f]">Actual for {formatMonthLabel(month)}</p>
            <p className="text-xs uppercase tracking-[0.12em] text-[#86868b]">
              Income {formatCurrency(budgetStatus?.income)}
            </p>
          </div>
          <BudgetStatusBar items={actual} normalize={hasNegativeSavings} />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {actual.map((item) => (
              <div key={item.key} className="rounded-2xl bg-[#f5f5f7] px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <p className="text-sm font-medium text-[#1d1d1f]">{item.label}</p>
                </div>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">{formatPercent(item.percent)}</p>
                <p className="mt-1 text-sm text-[#6e6e73]">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
          {!hasIncome ? (
            <p className="mt-3 text-sm text-[#86868b]">No income found for this month yet, so the actual percentages are shown as 0%.</p>
          ) : null}
          {hasNegativeSavings ? (
            <p className="mt-3 text-sm text-[#ff3b30]">
              Savings is negative this month, so the bar normalizes the visible segments while the percentages above still show the true values.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CategoryTrendsSection({ month, trends, budgetStatus }) {
  if (!trends?.length) {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Category Trends</h3>
        <BudgetStatusSection month={month} budgetStatus={budgetStatus} />
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Category Trends</h3>
      </div>

      <BudgetStatusSection month={month} budgetStatus={budgetStatus} />

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
            <CategoryTrendsSection
              month={overview.month}
              trends={overview.categoryTrends || []}
              budgetStatus={overview.budgetStatus}
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
