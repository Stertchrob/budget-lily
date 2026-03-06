"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiGet, apiPost, apiDelete } from "../../lib/apiClient";

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [unnamedMerchants, setUnnamedMerchants] = useState([]);
  const [aliases, setAliases] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [showAllRenames, setShowAllRenames] = useState(false);

  async function loadCategories() {
    try {
      const response = await apiGet("/categories");
      setCategories(response.data || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function loadMerchantData() {
    try {
      const [unnamedRes, aliasesRes] = await Promise.all([
        apiGet("/merchant-aliases/unnamed"),
        apiGet("/merchant-aliases"),
      ]);
      setUnnamedMerchants(unnamedRes.data || []);
      setAliases(aliasesRes.data || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    loadCategories();
    loadMerchantData();
  }, []);

  async function onCreateCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await apiPost("/categories", { name: newCategory.trim() });
      setMessage("Category created.");
      setNewCategory("");
      loadCategories();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function onRenameMerchant(e) {
    e.preventDefault();
    if (!selectedMerchant || !displayName.trim()) return;
    try {
      await apiPost("/merchant-aliases", { original: selectedMerchant, display: displayName.trim() });
      setMessage(`Renamed "${selectedMerchant}" to "${displayName.trim()}".`);
      setSelectedMerchant("");
      setDisplayName("");
      loadMerchantData();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function onRemoveAlias(aliasId) {
    try {
      await apiDelete(`/merchant-aliases/${aliasId}`);
      setMessage("Alias removed.");
      loadMerchantData();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-7xl px-4 pt-2 pb-16 sm:px-6">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#fbfbfd_0%,#f2f3f7_100%)] p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl">Settings</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6e73]">
                Keep your budget organized with cleaner merchant names and custom categories.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Categories</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{categories.length}</p>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Merchant Renames</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{aliases.length}</p>
              </div>
            </div>
          </div>
        </section>

        {message ? (
          <div className="mb-6 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm text-[#1d1d1f] shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            {message}
          </div>
        ) : null}

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Categories</h2>
              <p className="mt-1 text-sm text-[#6e6e73]">Create custom buckets for how you want transactions organized.</p>
            </div>

            <form onSubmit={onCreateCategory} className="mb-5 rounded-3xl bg-[#f5f5f7] p-3 sm:p-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">New category</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add category name"
                  className="flex-1"
                />
                <button className="btn-primary px-5" type="submit">Add</button>
              </div>
            </form>

            {categories.length ? (
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-2xl bg-[#f5f5f7] px-4 py-3">
                    <span className="font-medium text-[#1d1d1f]">{c.name}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#86868b] shadow-sm">Custom</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f5f5f7] px-4 py-5 text-sm text-[#6e6e73]">No categories yet.</div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Merchant Names</h2>
              <p className="mt-1 text-sm text-[#6e6e73]">Choose a merchant from the list and replace it with a cleaner name everywhere in the app.</p>
            </div>

            <form onSubmit={onRenameMerchant} className="mb-6 rounded-3xl bg-[#f5f5f7] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">Merchant</label>
                  <select
                    value={selectedMerchant}
                    onChange={(e) => {
                      setSelectedMerchant(e.target.value);
                      setDisplayName(e.target.value);
                    }}
                    className="w-full"
                  >
                    <option value="">Select a merchant…</option>
                    {unnamedMerchants.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">Display as</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. AT&T"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#6e6e73]">
                  {unnamedMerchants.length ? `${unnamedMerchants.length} merchants available to rename` : "All merchants have already been renamed."}
                </p>
                <button className="btn-primary px-5" type="submit" disabled={!selectedMerchant || !displayName.trim()}>
                  Save Rename
                </button>
              </div>
            </form>

            {unnamedMerchants.length === 0 && aliases.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f5f7] px-4 py-5 text-sm text-[#6e6e73]">
                No merchants yet. Upload statements to start renaming merchants.
              </div>
            ) : null}

            {aliases.length > 0 ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-[#86868b]">Current Renames</h3>
                  <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#86868b]">{aliases.length}</span>
                </div>
                <ul className="space-y-2">
                  {(showAllRenames ? aliases : aliases.slice(0, 5)).map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-4 rounded-2xl bg-[#f5f5f7] px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-[#86868b]">{a.original_merchant}</p>
                        <p className="truncate font-medium text-[#1d1d1f]">{a.display_name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveAlias(a.id)}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#86868b] shadow-sm transition hover:text-[#ff3b30]"
                        title="Remove rename"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                {aliases.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllRenames((v) => !v)}
                    className="mt-3 w-full rounded-2xl border border-[#e5e5ea] bg-white px-4 py-2.5 text-sm font-medium text-[#0071e3] transition hover:bg-[#f5f5f7]"
                  >
                    {showAllRenames ? "Show less" : `Show ${aliases.length - 5} more`}
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
