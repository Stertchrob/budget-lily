"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0071e3", "#30b0c7", "#34c759", "#ff9f0a", "#bf5af2", "#ff375f"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function OverviewCards({ totals }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="card">
        <p className="text-xs uppercase text-[#86868b]">Total Expenses</p>
        <p className="mt-2 text-3xl font-semibold">{formatCurrency(totals?.expenses)}</p>
      </div>
      <div className="card">
        <p className="text-xs uppercase text-[#86868b]">Total Income</p>
        <p className="mt-2 text-3xl font-semibold text-[#34c759]">{formatCurrency(totals?.income)}</p>
      </div>
      <div className="card">
        <p className="text-xs uppercase text-[#86868b]">Net Cash Flow</p>
        <p className={`mt-2 text-3xl font-semibold ${totals?.netCashFlow >= 0 ? "text-[#1d1d1f]" : "text-[#ff3b30]"}`}>
          {formatCurrency(totals?.netCashFlow)}
        </p>
      </div>
    </div>
  );
}

function TrendCard({ trendData }) {
  if (!trendData?.length) {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Monthly trend</h3>
        <div className="mt-6 flex h-72 items-center justify-center text-sm text-[#86868b]">No trend data</div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Monthly trend</h3>
          <p className="mt-1 text-sm text-[#6e6e73]">A softer look at how monthly spending changes over time.</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="reportsTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a84ff" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#0a84ff" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e5e5ea" strokeDasharray="2 6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#86868b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Spent"]}
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
              }}
            />
            <Area type="monotone" dataKey="amount" stroke="#0a84ff" strokeWidth={3} fill="url(#reportsTrendGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function CategoryBreakdown({ categoryData, totalSpent }) {
  const categories = (categoryData || []).slice(0, 8);

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Spending breakdown</h3>
        <p className="mt-1 text-sm text-[#6e6e73]">Clearer than a pie chart, but still easy to scan.</p>
      </div>
      <div className="space-y-4">
        {categories.map((item, index) => {
          const share = totalSpent ? (Math.abs(item.amount) / totalSpent) * 100 : 0;
          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium text-[#1d1d1f]">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#1d1d1f]">{formatCurrency(item.amount)}</p>
                  <p className="text-sm text-[#6e6e73]">{share.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#ececf1]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(share, 6)}%`, backgroundColor: COLORS[index % COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function ReportsCharts({ categoryData, trendData, totals, month }) {
  const totalSpent = Number(totals?.expenses || 0);

  return (
    <div className="space-y-6">
      <OverviewCards totals={totals} />
      <TrendCard trendData={trendData} />
      <CategoryBreakdown categoryData={categoryData} totalSpent={totalSpent} />
    </div>
  );
}
