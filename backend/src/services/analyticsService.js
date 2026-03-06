function getDateRange(isoMonth) {
  const now = new Date();
  if (isoMonth) {
    const from = `${isoMonth}-01`;
    const toDate = new Date(`${from}T00:00:00.000Z`);
    toDate.setUTCMonth(toDate.getUTCMonth() + 1);
    return { from, to: toDate.toISOString().slice(0, 10), month: isoMonth };
  }

  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  return { from: fromDate.toISOString().slice(0, 10), to: toDate.toISOString().slice(0, 10), month };
}

function computeOverview(transactions) {
  const expenses = transactions.filter((t) => t.amount < 0);
  const income = transactions.filter((t) => t.amount > 0);
  const byCategory = {};
  const byMerchant = {};
  const trend = {};
  const recurring = {};

  for (const txn of expenses) {
    const amount = Math.abs(txn.amount);
    const cat = txn.category_name || "Other";
    const merchant = txn.merchant || "Unknown";
    const month = String(txn.transaction_date || "").slice(0, 7);
    byCategory[cat] = (byCategory[cat] || 0) + amount;
    byMerchant[merchant] = (byMerchant[merchant] || 0) + amount;
    trend[month] = (trend[month] || 0) + amount;
    recurring[merchant] = (recurring[merchant] || 0) + 1;
  }

  const byCategoryRows = Object.entries(byCategory).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const byMerchantRows = Object.entries(byMerchant).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const trendRows = Object.entries(trend).map(([month, amount]) => ({ month, amount })).sort((a, b) => (a.month > b.month ? 1 : -1));
  const recurringSubscriptions = Object.entries(recurring)
    .filter(([, count]) => count >= 2)
    .map(([merchant, count]) => ({ merchant, count, monthlySpendEstimate: byMerchant[merchant] || 0 }))
    .sort((a, b) => b.monthlySpendEstimate - a.monthlySpendEstimate)
    .slice(0, 10);

  return {
    totals: {
      expenses: Math.abs(expenses.reduce((s, t) => s + t.amount, 0)),
      income: income.reduce((s, t) => s + t.amount, 0),
      netCashFlow: income.reduce((s, t) => s + t.amount, 0) - Math.abs(expenses.reduce((s, t) => s + t.amount, 0)),
    },
    byCategory: byCategoryRows,
    byMerchant: byMerchantRows,
    topMerchants: byMerchantRows.slice(0, 10),
    recurringSubscriptions,
    trend: trendRows,
  };
}

module.exports = { getDateRange, computeOverview };
