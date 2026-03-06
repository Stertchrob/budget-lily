const { parse } = require("csv-parse/sync");

function pick(row, keys) {
  const lowered = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase().trim(), v]));
  for (const key of keys) {
    if (lowered[key] !== undefined) return lowered[key];
    const match = Object.keys(lowered).find((h) => h === key || h.includes(key) || key.includes(h));
    if (match) return lowered[match];
  }
  return "";
}

/** Fix unescaped quotes inside quoted CSV fields without altering real closing quotes. */
function fixMalformedQuotes(text) {
  let result = "";
  let inQuotedField = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    const prev = text[i - 1];

    if (char !== '"') {
      result += char;
      continue;
    }

    if (!inQuotedField) {
      inQuotedField = true;
      result += char;
      continue;
    }

    if (next === '"') {
      result += '""';
      i += 1;
      continue;
    }

    const isClosingQuote = next === "," || next === "\n" || next === "\r" || next === undefined;
    if (isClosingQuote) {
      inQuotedField = false;
      result += char;
      continue;
    }

    const looksLikeQuotedFieldStart = prev === "," || prev === "\n" || prev === "\r" || prev === undefined;
    if (looksLikeQuotedFieldStart) {
      result += char;
      continue;
    }

    result += '""';
  }

  return result;
}

function findTransactionSection(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const headerKeys = ["date", "description", "amount"];
  for (let i = 0; i < lines.length; i++) {
    try {
      const parsed = parse(lines[i], { relax_column_count: true });
      const row = parsed[0];
      if (!row || !Array.isArray(row)) continue;
      const headers = row.map((h) => String(h || "").toLowerCase().trim()).filter(Boolean);
      const hasAll = headerKeys.every((k) => headers.some((h) => h === k || h.startsWith(k + " ") || h.includes(" " + k) || h.endsWith(" " + k)));
      if (hasAll) {
        return fixMalformedQuotes(lines.slice(i).join("\n"));
      }
    } catch {
      continue;
    }
  }
  return fixMalformedQuotes(text);
}

const SUMMARY_PATTERNS = /^(beginning balance|total credits|total debits|ending balance)\b/i;

function parseCsvStatement(buffer) {
  const text = buffer.toString("utf8");
  const csvContent = findTransactionSection(text);
  const rows = parse(csvContent, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });
  return rows
    .filter((row) => {
      const desc = pick(row, ["description", "memo", "details", "name"]);
      return !SUMMARY_PATTERNS.test(desc);
    })
    .map((row) => ({
      rawDate: pick(row, ["date", "transaction date", "posted date"]),
      rawDescription: pick(row, ["description", "memo", "details", "name"]),
      rawAmount: pick(row, ["amount", "debit", "credit", "transaction amount", "summary amt"]),
      rawMerchant: pick(row, ["merchant", "payee"]),
      raw: row,
    }));
}

module.exports = { parseCsvStatement };
