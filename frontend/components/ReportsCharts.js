"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#0071e3", "#34c759", "#ff9500", "#ff3b30", "#af52de", "#5ac8fa", "#86868b"];

export default function ReportsCharts({ categoryData, trendData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card">
        <h2 className="mb-3 text-lg font-semibold">Category Breakdown</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="amount" nameKey="name" outerRadius={90}>
                {categoryData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-3 text-lg font-semibold">Monthly Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid stroke="#e5e5ea" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, ""]} />
              <Bar dataKey="amount" fill="#0071e3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
