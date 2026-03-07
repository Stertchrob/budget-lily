"use client";
import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../components/AuthProvider";
import { apiPost } from "../../lib/apiClient";

export default function UploadsPage() {
  const [file, setFile] = useState(null);
  const [statementType, setStatementType] = useState("debit");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDemo } = useAuth();
  const hasFile = Boolean(file) && !isDemo;

  async function onUpload(e) {
    e.preventDefault();
    if (isDemo) {
      setMessage("Uploads are disabled in Explore mode.");
      return;
    }
    if (!file) return;
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("statement", file);
    formData.append("statementType", statementType);
    try {
      const response = await apiPost("/uploads/statements", formData, true);
      const skippedDuplicates = Number(response.skippedDuplicateCount || 0);
      setMessage(
        `Uploaded. Parsed ${response.parsedCount}, inserted ${response.insertedCount}, skipped ${skippedDuplicates} duplicate${skippedDuplicates === 1 ? "" : "s"}.`
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-7xl px-4 pt-2 pb-16 sm:px-6">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#fbfbfd_0%,#f2f3f7_100%)] p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl">Uploads</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6e73]">
                Bring in CSV statements with a cleaner, calmer import flow that matches the rest of your budget.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Formats</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">CSV</p>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#86868b]">Selected File</p>
                <p className="mt-2 truncate text-base font-semibold tracking-tight text-[#1d1d1f]">
                  {file ? file.name : "Nothing selected"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {message ? (
          <div className="mb-6 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm text-[#1d1d1f] shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            {message}
          </div>
        ) : null}
        {isDemo ? (
          <div className="mb-6 rounded-2xl border border-[#d8e7ff] bg-[#f5f9ff] px-4 py-3 text-sm text-[#1d1d1f] shadow-[0_10px_30px_rgba(0,113,227,0.06)]">
            Explore mode uses example data. Uploading transactions is disabled until you sign in with a real account.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Import statement</h2>
              <p className="mt-1 text-sm text-[#6e6e73]">
                Choose the statement type, add your file, and Budget Lily will parse and process it for you.
              </p>
            </div>

            <form className="space-y-5" onSubmit={onUpload}>
              <div className="rounded-3xl bg-[#f5f5f7] p-4">
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">
                  Statement type
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`cursor-pointer rounded-3xl border px-4 py-4 transition ${
                      statementType === "debit"
                        ? "border-[#0071e3]/20 bg-white text-[#1d1d1f] shadow-[0_8px_24px_rgba(0,113,227,0.10)]"
                        : "border-transparent bg-white/60 text-[#6e6e73]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="statementType"
                      value="debit"
                      checked={statementType === "debit"}
                      onChange={() => setStatementType("debit")}
                      disabled={isDemo}
                      className="sr-only"
                    />
                    <p className="text-sm font-semibold">Debit account</p>
                    <p className="mt-1 text-sm leading-6 text-inherit">Positive amounts are treated as deposits, while expenses remain negative.</p>
                  </label>
                  <label
                    className={`cursor-pointer rounded-3xl border px-4 py-4 transition ${
                      statementType === "credit"
                        ? "border-[#0071e3]/20 bg-white text-[#1d1d1f] shadow-[0_8px_24px_rgba(0,113,227,0.10)]"
                        : "border-transparent bg-white/60 text-[#6e6e73]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="statementType"
                      value="credit"
                      checked={statementType === "credit"}
                      onChange={() => setStatementType("credit")}
                      disabled={isDemo}
                      className="sr-only"
                    />
                    <p className="text-sm font-semibold">Credit card</p>
                    <p className="mt-1 text-sm leading-6 text-inherit">Positive amounts are treated as charges so spending lands in the right direction.</p>
                  </label>
                </div>
              </div>

              <div className="rounded-3xl bg-[#f5f5f7] p-4">
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-[#86868b]">
                  Statement file
                </label>
                <label className="block cursor-pointer rounded-[28px] border border-dashed border-[#d2d2d7] bg-white px-5 py-8 text-center transition hover:border-[#0071e3]/40 hover:bg-[#fbfbfd]">
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={isDemo}
                    className="sr-only"
                  />
                  <p className="text-base font-semibold text-[#1d1d1f]">
                    {file ? file.name : (isDemo ? "Uploads disabled in demo" : "Choose a CSV file")}
                  </p>
                  <p className="mt-2 text-sm text-[#6e6e73]">
                    {file
                      ? "Click to replace the selected file."
                      : (isDemo ? "Sign in to upload your own statements." : "Tap here to browse your computer and import a statement.")}
                  </p>
                  {file ? (
                    <p className="mt-4 inline-flex rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#86868b]">
                      Ready to upload
                    </p>
                  ) : null}
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#6e6e73]">
                  Supports bank statements in CSV format.
                </p>
                <button className="btn-primary px-5 py-2.5" disabled={!hasFile || loading}>
                  {isDemo ? "Uploads disabled in demo" : (loading ? "Uploading..." : "Upload and process")}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">How it works</h2>
              <p className="mt-1 text-sm text-[#6e6e73]">
                A few quick reminders before you import your next statement.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-[#f5f5f7] p-4">
                <p className="text-sm font-semibold text-[#1d1d1f]">1. Pick the right account type</p>
                <p className="mt-1 text-sm leading-6 text-[#6e6e73]">
                  Debit and credit statements treat positive amounts differently, so this choice affects your spending totals.
                </p>
              </div>
              <div className="rounded-3xl bg-[#f5f5f7] p-4">
                <p className="text-sm font-semibold text-[#1d1d1f]">2. Upload your raw statement</p>
                <p className="mt-1 text-sm leading-6 text-[#6e6e73]">
                  The importer parses the original file, normalizes merchants, and stores the new batch in your account.
                </p>
              </div>
              <div className="rounded-3xl bg-[#f5f5f7] p-4">
                <p className="text-sm font-semibold text-[#1d1d1f]">3. Review transactions after import</p>
                <p className="mt-1 text-sm leading-6 text-[#6e6e73]">
                  You can clean up categories, inspect duplicates, and verify everything from the transactions screen.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
