"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiGet, apiPatch, apiDelete } from "../../lib/apiClient";

const CATEGORIES = ["Groceries", "Rent", "Dining", "Gas", "Utilities", "Subscriptions", "Shopping", "Transport", "Income", "Other"];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TransactionsPage() {
  const [batches, setBatches] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [transactionsByBatch, setTransactionsByBatch] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  function loadBatches() {
    apiGet("/batches")
      .then((r) => setBatches(r.data || []))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadTransactions(batchId) {
    if (transactionsByBatch[batchId]) return;
    apiGet(`/transactions?batch=${batchId}`)
      .then((r) => setTransactionsByBatch((prev) => ({ ...prev, [batchId]: r.data || [] })))
      .catch((e) => setError(e.message));
  }

  function toggleBatch(id) {
    setExpandedId((prev) => (prev === id ? null : id));
    if (expandedId !== id) loadTransactions(id);
  }

  function startEdit(batch) {
    setEditingId(batch.id);
    setEditName(batch.displayName || batch.file_name || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveRename() {
    if (!editingId) return;
    try {
      await apiPatch(`/batches/${editingId}`, { name: editName.trim() });
      loadBatches();
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTransaction(txnId, batchId) {
    try {
      await apiDelete(`/transactions/${txnId}`);
      if (batchId) {
        const { data } = await apiGet(`/transactions?batch=${batchId}`);
        setTransactionsByBatch((prev) => ({ ...prev, [batchId]: data || [] }));
      }
      loadBatches();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteBatch(batchId, e) {
    e.stopPropagation();
    if (!confirm("Delete this batch and all its transactions?")) return;
    try {
      await apiDelete(`/batches/${batchId}`);
      setBatches((prev) => prev.filter((b) => b.id !== batchId));
      setTransactionsByBatch((prev) => {
        const next = { ...prev };
        delete next[batchId];
        return next;
      });
      if (expandedId === batchId) setExpandedId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateCategory(id, categoryName, batchId) {
    try {
      await apiPatch(`/transactions/${id}/category`, { categoryName });
      if (batchId) {
        const { data } = await apiGet(`/transactions?batch=${batchId}`);
        setTransactionsByBatch((prev) => ({ ...prev, [batchId]: data || [] }));
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleReviewed(txnId, batchId) {
    try {
      const { data } = await apiPatch(`/transactions/${txnId}/toggle-reviewed`, {});
      if (batchId) {
        setTransactionsByBatch((prev) => {
          const list = prev[batchId] || [];
          return { ...prev, [batchId]: list.map((t) => (t.id === txnId ? { ...t, category_edited: data.category_edited } : t)) };
        });
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-6 pb-16">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="mb-8 text-sm text-[#86868b]">View batches and recategorize transactions.</p>
        {error ? <div className="mb-4 rounded-xl bg-[#fff5f5] p-3 text-sm text-[#ff3b30]">{error}</div> : null}
        <div className="space-y-2">
          {batches.map((batch) => (
            <div key={batch.id} className="card overflow-hidden p-0">
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleBatch(batch.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleBatch(batch.id); } }}
                className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left hover:bg-[#fafafa]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#86868b]">
                    {expandedId === batch.id ? "▼" : "▶"}
                  </span>
                  {editingId === batch.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="rounded border border-[#d2d2d7] px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="font-medium text-[#1d1d1f]">
                      {batch.displayName || batch.file_name || "Untitled batch"}
                    </span>
                  )}
                  {editingId === batch.id ? (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); saveRename(); }}
                        className="text-sm text-[#0071e3]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                        className="text-sm text-[#86868b]"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); startEdit(batch); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); startEdit(batch); } }}
                      className="cursor-pointer text-xs text-[#86868b] hover:text-[#0071e3]"
                    >
                      Rename
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#86868b]">
                  <span>{formatDate(batch.created_at)}</span>
                  <span>{batch.transactionCount} transactions</span>
                  <button
                    type="button"
                    onClick={(e) => deleteBatch(batch.id, e)}
                    className="rounded p-1 text-[#86868b] hover:bg-[#fff5f5] hover:text-[#ff3b30]"
                    title="Delete batch"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {expandedId === batch.id && (
                <div className="border-t border-[#f5f5f7]">
                  {!transactionsByBatch[batch.id] ? (
                    <div className="px-6 py-4 text-sm text-[#86868b]">Loading transactions...</div>
                  ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#d2d2d7] bg-[#f5f5f7] text-left text-xs uppercase text-[#86868b]">
                          <th className="w-10 px-2 py-3"></th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Merchant</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(transactionsByBatch[batch.id] || []).map((txn) => (
                          <tr
                            key={txn.id}
                            className={`border-b border-[#f5f5f7] ${txn.category_edited ? "bg-[#e8f5e9]" : "bg-[#ffebee]"}`}
                          >
                            <td className="w-10 px-2 py-3">
                              <button
                                type="button"
                                onClick={() => toggleReviewed(txn.id, batch.id)}
                                className={`mr-1 rounded p-1 ${txn.category_edited ? "text-[#34c759]" : "text-[#86868b] hover:bg-[#e8f5e9] hover:text-[#34c759]"}`}
                                title={txn.category_edited ? "Mark as not reviewed" : "Mark as reviewed"}
                              >
                                {txn.category_edited ? "✓" : "○"}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteTransaction(txn.id, batch.id)}
                                className="rounded p-1 text-[#86868b] hover:bg-[#fff5f5] hover:text-[#ff3b30]"
                                title="Delete transaction"
                              >
                                ✕
                              </button>
                            </td>
                            <td className="px-4 py-3">{txn.transaction_date}</td>
                            <td className="px-4 py-3">{txn.merchant || "Unknown"}</td>
                            <td className="px-4 py-3 text-[#86868b]">{txn.description}</td>
                            <td className="px-4 py-3">${Number(txn.amount).toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <select
                                value={txn.category_name || "Other"}
                                onChange={(e) => updateCategory(txn.id, e.target.value, batch.id)}
                              >
                                {CATEGORIES.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {batches.length === 0 && !error ? (
          <p className="rounded-xl bg-white p-6 text-center text-sm text-[#86868b]">
            No batches yet. Upload a statement on the Uploads page.
          </p>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
