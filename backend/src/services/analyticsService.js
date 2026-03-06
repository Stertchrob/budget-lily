function getDateRange(isoMonth) {
  const now = new Date();
  if (isoMonth) {
    const toDate = new Date(`${isoMonth}-01T00:00:00.000Z`);
    toDate.setUTCMonth(toDate.getUTCMonth() + 1);
    const fromDate = new Date(`${isoMonth}-01T00:00:00.000Z`);
    fromDate.setUTCMonth(fromDate.getUTCMonth() - 11);
    return { from: fromDate.toISOString().slice(0, 10), to: toDate.toISOString().slice(0, 10), month: isoMonth };
  }

  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  return { from: fromDate.toISOString().slice(0, 10), to: toDate.toISOString().slice(0, 10), month };
}

function getPreviousMonth(isoMonth) {
  const date = new Date(`${isoMonth}-01T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() - 1);
  return date.toISOString().slice(0, 7);
}

function getMonthWindowCount() {
  return 12;
}

function getYearToDateAverageContext(transactions) {
  const latestTransactionDate = transactions
    .map((txn) => String(txn.transaction_date || ""))
    .filter(Boolean)
    .sort()
    .at(-1);

  if (!latestTransactionDate) {
    return { year: null, monthCount: 1 };
  }

  const latestDate = new Date(`${latestTransactionDate}T00:00:00.000Z`);
  return {
    year: latestDate.getUTCFullYear(),
    monthCount: latestDate.getUTCMonth() + 1,
  };
}

function computeOverview(transactions, selectedMonth) {
  const expenses = transactions.filter((t) => t.amount < 0);
  const income = transactions.filter((t) => t.amount > 0);
  const byCategory = {};
  const byCategoryMonth = {};
  const byMerchant = {};
  const recurring = {};
  const trend = {};

  for (const txn of expenses) {
    const amount = Math.abs(txn.amount);
    const cat = txn.category_name || "Other";
    const merchant = txn.merchant || "Unknown";
    const month = String(txn.transaction_date || "").slice(0, 7);
    byCategory[cat] = (byCategory[cat] || 0) + amount;
    byCategoryMonth[cat] = byCategoryMonth[cat] || {};
    byCategoryMonth[cat][month] = (byCategoryMonth[cat][month] || 0) + amount;
    byMerchant[merchant] = (byMerchant[merchant] || 0) + amount;
    recurring[merchant] = recurring[merchant] || { totalAmount: 0, transactionCount: 0, months: {} };
    recurring[merchant].totalAmount += amount;
    recurring[merchant].transactionCount += 1;
    recurring[merchant].months[month] = (recurring[merchant].months[month] || 0) + amount;
    trend[month] = (trend[month] || 0) + amount;
  }

  const byCategoryRows = Object.entries(byCategory).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const byMerchantRows = Object.entries(byMerchant).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const trendRows = Object.entries(trend).map(([month, amount]) => ({ month, amount })).sort((a, b) => (a.month > b.month ? 1 : -1));
  const monthCount = getMonthWindowCount();
  const currentMonth = selectedMonth || (trendRows.length ? trendRows[trendRows.length - 1].month : "");
  const previousMonth = currentMonth ? getPreviousMonth(currentMonth) : "";
  const categoryTrends = Object.entries(byCategoryMonth)
    .map(([name, months]) => {
      const currentAmount = months[currentMonth] || 0;
      const previousAmount = months[previousMonth] || 0;
      const changeAmount = currentAmount - previousAmount;
      const changePercent = previousAmount > 0 ? (changeAmount / previousAmount) * 100 : null;

      return {
        name,
        currentAmount,
        previousAmount,
        changeAmount,
        changePercent,
      };
    })
    .filter((item) => item.currentAmount > 0 || item.previousAmount > 0)
    .sort((a, b) => b.currentAmount - a.currentAmount);
  const recurringCharges = Object.entries(recurring)
    .map(([merchant, stats]) => {
      const activeMonths = Object.keys(stats.months).sort();
      return {
        merchant,
        count: stats.transactionCount,
        activeMonths: activeMonths.length,
        averageMonthlySpend: activeMonths.length ? stats.totalAmount / activeMonths.length : 0,
        totalAmount: stats.totalAmount,
      };
    })
    .filter((item) => item.activeMonths >= 2)
    .map((item) => ({
      ...item,
      averageMonthlySpend: item.averageMonthlySpend,
    }))
    .sort((a, b) => b.averageMonthlySpend - a.averageMonthlySpend)
    .slice(0, 10);
  const byCategoryAverage = byCategoryRows.map((item) => ({
    ...item,
    amount: item.amount / monthCount,
  }));
  const topMerchantsAverage = byMerchantRows
    .map((item) => ({
      ...item,
      amount: item.amount / monthCount,
    }))
    .slice(0, 10);
  const totalExpenses = Math.abs(expenses.reduce((s, t) => s + t.amount, 0));
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const averageContext = getYearToDateAverageContext(transactions);
  const transactionsInAverageYear = averageContext.year
    ? transactions.filter((txn) => String(txn.transaction_date || "").startsWith(`${averageContext.year}-`))
    : transactions;
  const expensesInAverageYear = transactionsInAverageYear.filter((txn) => txn.amount < 0);
  const incomeInAverageYear = transactionsInAverageYear.filter((txn) => txn.amount > 0);
  const yearToDateExpenses = Math.abs(expensesInAverageYear.reduce((sum, txn) => sum + txn.amount, 0));
  const yearToDateIncome = incomeInAverageYear.reduce((sum, txn) => sum + txn.amount, 0);

  return {
    totals: {
      expenses: totalExpenses,
      income: totalIncome,
      netCashFlow: totalIncome - totalExpenses,
    },
    averages: {
      spendPerMonth: yearToDateExpenses / averageContext.monthCount,
      incomePerMonth: yearToDateIncome / averageContext.monthCount,
      transactionsPerMonth: transactionsInAverageYear.length / averageContext.monthCount,
    },
    byCategory: byCategoryRows,
    byCategoryAverage,
    byMerchant: byMerchantRows,
    topMerchants: byMerchantRows.slice(0, 10),
    topMerchantsAverage,
    recurringCharges,
    trend: trendRows,
    categoryTrends,
    monthCount,
  };
}

module.exports = { getDateRange, computeOverview };
