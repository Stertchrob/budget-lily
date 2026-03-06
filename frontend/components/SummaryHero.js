"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatMonthLabel(month) {
  if (!month) return "Overview";
  const date = new Date(`${month}-01T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function SummaryHero({ totals, trendData, month }) {
  const sparklineData = (trendData || []).map((item) => ({ ...item, label: item.month.slice(5) }));

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#fbfbfd_0%,#f3f4f8_100%)] p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-medium text-[#86868b]">{formatMonthLabel(month)}</p>
          <h2 className="mt-2 max-w-xl text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl">
            A calmer view of how your money moved.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6e73]">
            See your spending patterns, strongest categories, and overall cash flow in a layout inspired by Apple's summary screens.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Spent</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{formatCurrency(totals?.expenses)}</p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Income</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{formatCurrency(totals?.income)}</p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Net</p>
              <p className={`mt-2 text-2xl font-semibold tracking-tight ${totals?.netCashFlow >= 0 ? "text-[#1d1d1f]" : "text-[#ff3b30]"}`}>
                {formatCurrency(totals?.netCashFlow)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/80 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Spending trend</p>
              <p className="mt-1 text-sm text-[#6e6e73]">Last {sparklineData.length || 0} months</p>
            </div>
            <div className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#6e6e73]">
              {sparklineData.length ? sparklineData[sparklineData.length - 1].month : "No data"}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="summaryHeroGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#0071e3" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Spent"]}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0071e3"
                  strokeWidth={3}
                  fill="url(#summaryHeroGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
