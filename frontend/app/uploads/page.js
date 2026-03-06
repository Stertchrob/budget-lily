"use client";
import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiPost } from "../../lib/apiClient";

export default function UploadsPage() {
  const [file, setFile] = useState(null);
  const [statementType, setStatementType] = useState("debit");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("statement", file);
    formData.append("statementType", statementType);
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
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Upload Statements</h1>
        <p className="mb-8 text-sm text-[#86868b]">Import CSV or PDF bank statements.</p>
        <div className="card">
          <form className="space-y-4" onSubmit={onUpload}>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">Statement type</label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="statementType" value="debit" checked={statementType === "debit"} onChange={() => setStatementType("debit")} />
                  <span className="text-sm">Debit</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="statementType" value="credit" checked={statementType === "credit"} onChange={() => setStatementType("credit")} />
                  <span className="text-sm">Credit</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-[#86868b]">Credit card: positive amounts = charges (expenses). Debit: positive = deposits (income).</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">File</label>
              <input type="file" accept=".csv,.pdf,text/csv,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <button className="btn-primary" disabled={!file || loading}>{loading ? "Uploading..." : "Upload and process"}</button>
            {message ? <p className="text-sm">{message}</p> : null}
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
