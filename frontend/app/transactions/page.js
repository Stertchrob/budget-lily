"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import NavBar from "../../components/NavBar";
import { apiGet, apiPatch } from "../../lib/apiClient";

const CATEGORIES = ["Groceries", "Rent", "Dining", "Gas", "Utilities", "Subscriptions", "Shopping", "Transport", "Income", "Other"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  function load() {
    apiGet("/transactions").then((r) => setTransactions(r.data || [])).catch((e) => setError(e.message));
  }
  useEffect(() => { load(); }, []);

  async function updateCategory(id, categoryName) {
    try {
      await apiPatch(`/transactions/${id}/category`, { categoryName });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-6 pb-16">
        <NavBar />
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="mb-8 text-sm text-[#86868b]">View and recategorize transactions.</p>
        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        <div className="card overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#d2d2d7] bg-[#f5f5f7] text-left text-xs uppercase text-[#86868b]">
                <th className="px-4 py-3">Date</th><th className="px-4 py-3">Merchant</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-[#f5f5f7]">
                  <td className="px-4 py-3">{txn.transaction_date}</td>
                  <td className="px-4 py-3">{txn.merchant || "Unknown"}</td>
                  <td className="px-4 py-3 text-[#86868b]">{txn.description}</td>
                  <td className="px-4 py-3">${Number(txn.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select value={txn.category_name || "Other"} onChange={(e) => updateCategory(txn.id, e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </ProtectedRoute>
  );
}
