"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiGet, apiPost } from "../../lib/apiClient";

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState("");

  async function loadCategories() {
    try {
      const response = await apiGet("/categories");
      setCategories(response.data || []);
    } catch (err) {
      setMessage(err.message);
    }
  }
  useEffect(() => { loadCategories(); }, []);

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

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-2xl px-6 pb-16">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mb-8 text-sm text-[#86868b]">Manage custom categories.</p>
        <div className="card">
          <form onSubmit={onCreateCategory} className="mb-4 flex gap-2">
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Add category name" />
            <button className="btn-primary" type="submit">Add</button>
          </form>
          {message ? <p className="mb-3 text-sm">{message}</p> : null}
          <ul className="list-disc pl-5 text-sm">{categories.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
        </div>
      </main>
    </ProtectedRoute>
  );
}
