"use client";
import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import NavBar from "../../components/NavBar";
import { apiPost } from "../../lib/apiClient";

export default function UploadsPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("statement", file);
    try {
      const response = await apiPost("/uploads/statements", formData, true);
      setMessage(`Uploaded. Parsed ${response.parsedCount}, inserted ${response.insertedCount}.`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-2xl px-6 pb-16">
        <NavBar />
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Upload Statements</h1>
        <p className="mb-8 text-sm text-[#86868b]">Import CSV bank statements.</p>
        <div className="card">
          <form className="space-y-4" onSubmit={onUpload}>
            <input type="file" accept=".csv,.pdf,text/csv,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="btn-primary" disabled={!file || loading}>{loading ? "Uploading..." : "Upload and process"}</button>
            {message ? <p className="text-sm">{message}</p> : null}
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
