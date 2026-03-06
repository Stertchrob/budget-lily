"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiGet, apiPatch, apiDelete } from "../../lib/apiClient";

const DEFAULT_CATEGORIES = ["Groceries", "Rent", "Dining", "Gas", "Utilities", "Subscriptions", "Shopping", "Transport", "Income", "Other"];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TransactionsPage() {
  const [batches, setBatches] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [expandedId, setExpandedId] = useState(null);
  const [transactionsByBatch, setTransactionsByBatch] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const totalTransactions = batches.reduce((sum, batch) => sum + (batch.transactionCount || 0), 0);
  const expandedBatch = batches.find((batch) => batch.id === expandedId);

  function loadBatches() {
    apiGet("/batches")
      .then((r) => setBatches(r.data || []))
      .catch((e) => setError(e.message));
  }

  function loadCategories() {
    apiGet("/categories")
      .then((r) => {
        const customCategories = (r.data || []).map((category) => category.name).filter(Boolean);
        setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...customCategories])));
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadBatches();
    loadCategories();
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
      <main className="mx-auto w-full max-w-7xl px-4 pt-2 pb-16 sm:px-6">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#fbfbfd_0%,#f2f3f7_100%)] p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl">Transactions</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6e73]">
                Review each imported batch, clean up categories, and keep every statement organized in the same calm style as the rest of the app.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Batches</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{batches.length}</p>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Imported Transactions</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{totalTransactions}</p>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#ffd9d6] bg-[#fff5f5] px-4 py-3 text-sm text-[#c9342c] shadow-[0_10px_30px_rgba(255,59,48,0.08)]">
            {error}
          </div>
        ) : null}

        {batches.length > 0 ? (
          <section className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl bg-[#f5f5f7] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">Library</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#1d1d1f]">Imported batches</h2>
                <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
                  Expand a batch to rename it, review transactions, and recategorize anything that needs a closer look.
                </p>
              </div>
              <div className="rounded-3xl bg-[#f5f5f7] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">Focused Batch</p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">
                  {expandedBatch ? (expandedBatch.displayName || expandedBatch.file_name || "Untitled batch") : "Select a batch"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
                  {expandedBatch
                    ? `${expandedBatch.transactionCount || 0} transactions from ${formatDate(expandedBatch.created_at)}`
                    : "Open any batch below to review the imported transactions in detail."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <div className="space-y-4">
          {batches.map((batch) => (
            <section
              key={batch.id}
              className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleBatch(batch.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleBatch(batch.id); } }}
                className="flex w-full cursor-pointer flex-col gap-4 px-6 py-5 text-left transition hover:bg-white/60 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-sm text-[#86868b]">
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
                      className="min-w-0 rounded-2xl border border-[#d2d2d7] bg-white px-3 py-2 text-sm"
                    />
                  ) : (
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1d1d1f]">
                        {batch.displayName || batch.file_name || "Untitled batch"}
                      </p>
                      <p className="mt-1 text-sm text-[#6e6e73]">
                        Imported {formatDate(batch.created_at)}
                      </p>
                    </div>
                  )}
                  {editingId === batch.id ? (
                    <span className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); saveRename(); }}
                        className="rounded-full bg-[#e8f2ff] px-3 py-1 text-sm font-medium text-[#0071e3]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                        className="rounded-full bg-[#f5f5f7] px-3 py-1 text-sm font-medium text-[#86868b]"
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
                      className="cursor-pointer rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#86868b] transition hover:bg-[#e8f2ff] hover:text-[#0071e3]"
                    >
                      Rename
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#86868b]">
                  <span className="rounded-full bg-[#f5f5f7] px-3 py-1 font-medium">
                    {batch.transactionCount} transactions
                  </span>
                  <button
                    type="button"
                    onClick={(e) => deleteBatch(batch.id, e)}
                    className="rounded-full bg-[#f5f5f7] px-3 py-1 font-medium text-[#86868b] transition hover:bg-[#fff0ef] hover:text-[#ff3b30]"
                    title="Delete batch"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expandedId === batch.id && (
                <div className="border-t border-white/70 bg-[#fbfbfd] px-3 pb-3">
                  {!transactionsByBatch[batch.id] ? (
                    <div className="px-4 py-6 text-sm text-[#86868b]">Loading transactions...</div>
                  ) : (
                    <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#e5e5ea] bg-[#f5f5f7] text-left text-xs uppercase tracking-[0.12em] text-[#86868b]">
                              <th className="w-24 px-4 py-3">Actions</th>
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
                                className={`border-b border-[#f5f5f7] last:border-b-0 ${
                                  txn.category_edited ? "bg-[#f6fbf7]" : "bg-[#fffafa]"
                                }`}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleReviewed(txn.id, batch.id)}
                                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                                        txn.category_edited
                                          ? "bg-[#e8f5e9] text-[#34c759]"
                                          : "bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8f5e9] hover:text-[#34c759]"
                                      }`}
                                      title={txn.category_edited ? "Mark as not reviewed" : "Mark as reviewed"}
                                    >
                                      {txn.category_edited ? "Reviewed" : "Review"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteTransaction(txn.id, batch.id)}
                                      className="rounded-full bg-[#f5f5f7] px-2.5 py-1 text-xs font-medium text-[#86868b] transition hover:bg-[#fff0ef] hover:text-[#ff3b30]"
                                      title="Delete transaction"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-[#1d1d1f]">{formatDate(txn.transaction_date)}</td>
                                <td className="px-4 py-3 font-medium text-[#1d1d1f]">{txn.merchant || "Unknown"}</td>
                                <td className="px-4 py-3 text-[#6e6e73]">{txn.description}</td>
                                <td className="px-4 py-3 font-medium text-[#1d1d1f]">${Number(txn.amount).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                  <select
                                    value={txn.category_name || "Other"}
                                    onChange={(e) => updateCategory(txn.id, e.target.value, batch.id)}
                                    className="min-w-[10rem] bg-white"
                                  >
                                    {Array.from(new Set([...categories, txn.category_name || "Other"])).map((c) => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          ))}
        </div>
        {batches.length === 0 && !error ? (
          <section className="rounded-[28px] border border-white/70 bg-white/80 p-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <p className="text-lg font-semibold tracking-tight text-[#1d1d1f]">No batches yet</p>
            <p className="mt-2 text-sm text-[#6e6e73]">
              Upload a statement on the Uploads page to start building your transaction history.
            </p>
          </section>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
