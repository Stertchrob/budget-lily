"use client";

const demoBatches = [
  {
    id: "batch-feb-checking",
    file_name: "checking-february.csv",
    name: "February Checking",
    displayName: "February Checking",
    created_at: "2026-02-28T17:30:00.000Z",
    transactionCount: 5,
  },
  {
    id: "batch-feb-credit",
    file_name: "credit-february.csv",
    name: "February Credit",
    displayName: "February Credit",
    created_at: "2026-02-27T20:10:00.000Z",
    transactionCount: 5,
  },
  {
    id: "batch-jan-checking",
    file_name: "checking-january.csv",
    name: "January Checking",
    displayName: "January Checking",
    created_at: "2026-01-31T18:45:00.000Z",
    transactionCount: 5,
  },
];

const demoTransactions = [
  {
    id: "txn-feb-1",
    statement_upload_id: "batch-feb-checking",
    transaction_date: "2026-02-28",
    amount: 2600,
    merchant: "Acme Payroll",
    description: "Payroll Deposit",
    category_name: "Income",
    category_edited: true,
  },
  {
    id: "txn-feb-2",
    statement_upload_id: "batch-feb-checking",
    transaction_date: "2026-02-03",
    amount: -1600,
    merchant: "Oak Street Apartments",
    description: "Monthly Rent",
    category_name: "Rent",
    category_edited: true,
  },
  {
    id: "txn-feb-3",
    statement_upload_id: "batch-feb-checking",
    transaction_date: "2026-02-07",
    amount: -180,
    merchant: "City Utilities",
    description: "Electric and water",
    category_name: "Utilities",
    category_edited: false,
  },
  {
    id: "txn-feb-4",
    statement_upload_id: "batch-feb-checking",
    transaction_date: "2026-02-12",
    amount: -420,
    merchant: "Whole Foods",
    description: "Groceries",
    category_name: "Groceries",
    category_edited: true,
  },
  {
    id: "txn-feb-5",
    statement_upload_id: "batch-feb-checking",
    transaction_date: "2026-02-22",
    amount: -160,
    merchant: "Metro Transit",
    description: "Transit pass reload",
    category_name: "Transport",
    category_edited: false,
  },
  {
    id: "txn-feb-6",
    statement_upload_id: "batch-feb-credit",
    transaction_date: "2026-02-04",
    amount: -120,
    merchant: "Shell",
    description: "Fuel purchase",
    category_name: "Gas",
    category_edited: false,
  },
  {
    id: "txn-feb-7",
    statement_upload_id: "batch-feb-credit",
    transaction_date: "2026-02-08",
    amount: -150,
    merchant: "Sweetgreen",
    description: "Lunch and dinner",
    category_name: "Dining",
    category_edited: false,
  },
  {
    id: "txn-feb-8",
    statement_upload_id: "batch-feb-credit",
    transaction_date: "2026-02-14",
    amount: -95,
    merchant: "Target",
    description: "Home essentials",
    category_name: "Shopping",
    category_edited: false,
  },
  {
    id: "txn-feb-9",
    statement_upload_id: "batch-feb-credit",
    transaction_date: "2026-02-18",
    amount: -45,
    merchant: "Spotify",
    description: "Monthly subscription",
    category_name: "Subscriptions",
    category_edited: false,
  },
  {
    id: "txn-feb-10",
    statement_upload_id: "batch-feb-credit",
    transaction_date: "2026-02-25",
    amount: -30,
    merchant: "Airbnb",
    description: "Weekend booking deposit",
    category_name: "Travel",
    category_edited: true,
  },
  {
    id: "txn-jan-1",
    statement_upload_id: "batch-jan-checking",
    transaction_date: "2026-01-31",
    amount: 2600,
    merchant: "Acme Payroll",
    description: "Payroll Deposit",
    category_name: "Income",
    category_edited: true,
  },
  {
    id: "txn-jan-2",
    statement_upload_id: "batch-jan-checking",
    transaction_date: "2026-01-03",
    amount: -1600,
    merchant: "Oak Street Apartments",
    description: "Monthly Rent",
    category_name: "Rent",
    category_edited: true,
  },
  {
    id: "txn-jan-3",
    statement_upload_id: "batch-jan-checking",
    transaction_date: "2026-01-08",
    amount: -170,
    merchant: "City Utilities",
    description: "Electric and water",
    category_name: "Utilities",
    category_edited: false,
  },
  {
    id: "txn-jan-4",
    statement_upload_id: "batch-jan-checking",
    transaction_date: "2026-01-13",
    amount: -470,
    merchant: "Whole Foods",
    description: "Groceries",
    category_name: "Groceries",
    category_edited: true,
  },
  {
    id: "txn-jan-5",
    statement_upload_id: "batch-jan-checking",
    transaction_date: "2026-01-23",
    amount: -220,
    merchant: "Metro Transit",
    description: "Transit and rideshare",
    category_name: "Transport",
    category_edited: false,
  },
];

const demoCategories = [
  { id: "cat-1", name: "Travel" },
  { id: "cat-2", name: "Gifts" },
  { id: "cat-3", name: "Pet Care" },
];

const demoAliases = [
  { id: "alias-1", original_merchant: "WHOLEFDS MKT #102", display_name: "Whole Foods" },
  { id: "alias-2", original_merchant: "MTA*NYCT PAYGO", display_name: "Metro Transit" },
  { id: "alias-3", original_merchant: "SPOTIFY USA", display_name: "Spotify" },
];

const demoUnnamedMerchants = ["LOCAL CAFE 4412", "CITY PARKING 884", "CORNER MARKET 19"];

const demoOverviewByMonth = {
  "2025-12": {
    month: "2025-12",
    totals: { expenses: 2840, income: 4900, netCashFlow: 2060 },
    currentMonthTotals: { expenses: 2840, income: 4900, netCashFlow: 2060 },
    averages: { spendPerMonth: 2840, incomePerMonth: 4900, transactionsPerMonth: 11.0 },
    byCategoryAverage: [
      { name: "Rent", amount: 1600 },
      { name: "Groceries", amount: 430 },
      { name: "Transport", amount: 210 },
      { name: "Utilities", amount: 160 },
      { name: "Dining", amount: 160 },
      { name: "Gas", amount: 115 },
    ],
    topMerchants: [
      { name: "Oak Street Apartments", amount: 1600 },
      { name: "Whole Foods", amount: 430 },
      { name: "Metro Transit", amount: 210 },
      { name: "City Utilities", amount: 160 },
      { name: "Sweetgreen", amount: 160 },
    ],
    recurringCharges: [
      { merchant: "Oak Street Apartments", count: 1, activeMonths: 1, averageMonthlySpend: 1600, totalAmount: 1600 },
    ],
    trend: [
      { month: "2025-12", amount: 2840 },
      { month: "2026-01", amount: 3120 },
      { month: "2026-02", amount: 2980 },
      { month: "2026-03", amount: 3250 },
    ],
    categoryTrends: [
      { name: "Rent", currentAmount: 1600, previousAmount: 0, changeAmount: 1600, changePercent: null },
      { name: "Groceries", currentAmount: 430, previousAmount: 0, changeAmount: 430, changePercent: null },
      { name: "Transport", currentAmount: 210, previousAmount: 0, changeAmount: 210, changePercent: null },
    ],
    budgetStatus: {
      income: 4900,
      spent: 2840,
      savingsAmount: 2060,
      needs: { amount: 2085, percent: 42.6 },
      wants: { amount: 755, percent: 15.4 },
      savings: { amount: 2060, percent: 42.0 },
    },
    monthCount: 12,
  },
  "2026-01": {
    month: "2026-01",
    totals: { expenses: 3120, income: 5200, netCashFlow: 2080 },
    currentMonthTotals: { expenses: 3120, income: 5200, netCashFlow: 2080 },
    averages: { spendPerMonth: 2980, incomePerMonth: 5050, transactionsPerMonth: 12.4 },
    byCategoryAverage: [
      { name: "Rent", amount: 1600 },
      { name: "Groceries", amount: 450 },
      { name: "Transport", amount: 215 },
      { name: "Utilities", amount: 165 },
      { name: "Dining", amount: 185 },
      { name: "Shopping", amount: 100 },
    ],
    topMerchants: [
      { name: "Oak Street Apartments", amount: 1600 },
      { name: "Whole Foods", amount: 450 },
      { name: "Metro Transit", amount: 215 },
      { name: "City Utilities", amount: 165 },
      { name: "Sweetgreen", amount: 185 },
    ],
    recurringCharges: [
      { merchant: "Oak Street Apartments", count: 2, activeMonths: 2, averageMonthlySpend: 1600, totalAmount: 3200 },
      { merchant: "Whole Foods", count: 2, activeMonths: 2, averageMonthlySpend: 450, totalAmount: 900 },
      { merchant: "Metro Transit", count: 2, activeMonths: 2, averageMonthlySpend: 215, totalAmount: 430 },
    ],
    trend: [
      { month: "2025-12", amount: 2840 },
      { month: "2026-01", amount: 3120 },
      { month: "2026-02", amount: 2980 },
      { month: "2026-03", amount: 3250 },
    ],
    categoryTrends: [
      { name: "Rent", currentAmount: 1600, previousAmount: 1600, changeAmount: 0, changePercent: 0 },
      { name: "Groceries", currentAmount: 470, previousAmount: 430, changeAmount: 40, changePercent: 9.3 },
      { name: "Transport", currentAmount: 220, previousAmount: 210, changeAmount: 10, changePercent: 4.8 },
      { name: "Dining", currentAmount: 210, previousAmount: 160, changeAmount: 50, changePercent: 31.3 },
      { name: "Travel", currentAmount: 80, previousAmount: 0, changeAmount: 80, changePercent: null },
    ],
    budgetStatus: {
      income: 5200,
      spent: 3120,
      savingsAmount: 2080,
      needs: { amount: 2110, percent: 40.6 },
      wants: { amount: 1010, percent: 19.4 },
      savings: { amount: 2080, percent: 40.0 },
    },
    monthCount: 12,
  },
  "2026-02": {
    month: "2026-02",
    totals: { expenses: 6100, income: 10400, netCashFlow: 4300 },
    currentMonthTotals: { expenses: 2980, income: 5200, netCashFlow: 2220 },
    averages: { spendPerMonth: 3050, incomePerMonth: 5200, transactionsPerMonth: 13.0 },
    byCategoryAverage: [
      { name: "Rent", amount: 1600 },
      { name: "Groceries", amount: 445 },
      { name: "Transport", amount: 190 },
      { name: "Utilities", amount: 175 },
      { name: "Dining", amount: 180 },
      { name: "Gas", amount: 120 },
      { name: "Shopping", amount: 118 },
      { name: "Subscriptions", amount: 45 },
    ],
    topMerchants: [
      { name: "Oak Street Apartments", amount: 1600 },
      { name: "Whole Foods", amount: 445 },
      { name: "Metro Transit", amount: 190 },
      { name: "City Utilities", amount: 175 },
      { name: "Sweetgreen", amount: 180 },
      { name: "Shell", amount: 120 },
    ],
    recurringCharges: [
      { merchant: "Oak Street Apartments", count: 3, activeMonths: 3, averageMonthlySpend: 1600, totalAmount: 4800 },
      { merchant: "Whole Foods", count: 3, activeMonths: 3, averageMonthlySpend: 473.3, totalAmount: 1420 },
      { merchant: "Metro Transit", count: 3, activeMonths: 3, averageMonthlySpend: 196.7, totalAmount: 590 },
      { merchant: "City Utilities", count: 3, activeMonths: 3, averageMonthlySpend: 170, totalAmount: 510 },
    ],
    trend: [
      { month: "2025-12", amount: 2840 },
      { month: "2026-01", amount: 3120 },
      { month: "2026-02", amount: 2980 },
      { month: "2026-03", amount: 3250 },
    ],
    categoryTrends: [
      { name: "Rent", currentAmount: 1600, previousAmount: 1600, changeAmount: 0, changePercent: 0 },
      { name: "Groceries", currentAmount: 420, previousAmount: 470, changeAmount: -50, changePercent: -10.6 },
      { name: "Utilities", currentAmount: 180, previousAmount: 170, changeAmount: 10, changePercent: 5.9 },
      { name: "Transport", currentAmount: 160, previousAmount: 220, changeAmount: -60, changePercent: -27.3 },
      { name: "Dining", currentAmount: 150, previousAmount: 210, changeAmount: -60, changePercent: -28.6 },
      { name: "Shopping", currentAmount: 95, previousAmount: 140, changeAmount: -45, changePercent: -32.1 },
      { name: "Travel", currentAmount: 30, previousAmount: 80, changeAmount: -50, changePercent: -62.5 },
    ],
    budgetStatus: {
      income: 5200,
      spent: 2980,
      savingsAmount: 2220,
      needs: { amount: 2060, percent: 39.6 },
      wants: { amount: 920, percent: 17.7 },
      savings: { amount: 2220, percent: 42.7 },
    },
    monthCount: 12,
  },
  "2026-03": {
    month: "2026-03",
    totals: { expenses: 9350, income: 15800, netCashFlow: 6450 },
    currentMonthTotals: { expenses: 3250, income: 5400, netCashFlow: 2150 },
    averages: { spendPerMonth: 3116.7, incomePerMonth: 5266.7, transactionsPerMonth: 13.6 },
    byCategoryAverage: [
      { name: "Rent", amount: 1600 },
      { name: "Groceries", amount: 452 },
      { name: "Transport", amount: 197 },
      { name: "Utilities", amount: 181.7 },
      { name: "Dining", amount: 190 },
      { name: "Gas", amount: 128.3 },
      { name: "Shopping", amount: 115 },
      { name: "Travel", amount: 90 },
    ],
    topMerchants: [
      { name: "Oak Street Apartments", amount: 1600 },
      { name: "Whole Foods", amount: 452 },
      { name: "Metro Transit", amount: 197 },
      { name: "City Utilities", amount: 181.7 },
      { name: "Sweetgreen", amount: 190 },
      { name: "Shell", amount: 128.3 },
    ],
    recurringCharges: [
      { merchant: "Oak Street Apartments", count: 4, activeMonths: 4, averageMonthlySpend: 1600, totalAmount: 6400 },
      { merchant: "Whole Foods", count: 4, activeMonths: 4, averageMonthlySpend: 470, totalAmount: 1880 },
      { merchant: "Metro Transit", count: 4, activeMonths: 4, averageMonthlySpend: 207.5, totalAmount: 830 },
      { merchant: "City Utilities", count: 4, activeMonths: 4, averageMonthlySpend: 176.3, totalAmount: 705 },
    ],
    trend: [
      { month: "2025-12", amount: 2840 },
      { month: "2026-01", amount: 3120 },
      { month: "2026-02", amount: 2980 },
      { month: "2026-03", amount: 3250 },
    ],
    categoryTrends: [
      { name: "Rent", currentAmount: 1600, previousAmount: 1600, changeAmount: 0, changePercent: 0 },
      { name: "Groceries", currentAmount: 460, previousAmount: 420, changeAmount: 40, changePercent: 9.5 },
      { name: "Utilities", currentAmount: 195, previousAmount: 180, changeAmount: 15, changePercent: 8.3 },
      { name: "Transport", currentAmount: 210, previousAmount: 160, changeAmount: 50, changePercent: 31.3 },
      { name: "Dining", currentAmount: 220, previousAmount: 150, changeAmount: 70, changePercent: 46.7 },
      { name: "Travel", currentAmount: 160, previousAmount: 30, changeAmount: 130, changePercent: 433.3 },
    ],
    budgetStatus: {
      income: 5400,
      spent: 3250,
      savingsAmount: 2150,
      needs: { amount: 2135, percent: 39.5 },
      wants: { amount: 1115, percent: 20.6 },
      savings: { amount: 2150, percent: 39.8 },
    },
    monthCount: 12,
  },
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getOverview(path) {
  const url = new URL(path, "https://demo.local");
  const requestedMonth = url.searchParams.get("month") || "2026-03";
  return clone(demoOverviewByMonth[requestedMonth] || demoOverviewByMonth["2026-03"]);
}

export function getDemoResponse(path) {
  const url = new URL(path, "https://demo.local");
  const pathname = url.pathname;

  if (pathname === "/reports/overview") return getOverview(path);
  if (pathname === "/batches") return { data: clone(demoBatches) };
  if (pathname === "/categories") return { data: clone(demoCategories) };
  if (pathname === "/merchant-aliases") return { data: clone(demoAliases) };
  if (pathname === "/merchant-aliases/unnamed") return { data: clone(demoUnnamedMerchants) };
  if (pathname === "/transactions") {
    const batchId = url.searchParams.get("batch");
    const data = batchId
      ? demoTransactions.filter((txn) => txn.statement_upload_id === batchId)
      : demoTransactions;
    return { data: clone(data) };
  }

  throw new Error("Demo data is not available for this screen yet.");
}

export const demoUser = {
  id: "demo-user",
  email: "explore@budgetlily.demo",
};
