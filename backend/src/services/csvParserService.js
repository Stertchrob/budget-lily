const { parse } = require("csv-parse/sync");

function pick(row, keys) {
  const lowered = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase().trim(), v]));
  for (const key of keys) {
    if (lowered[key] !== undefined) return lowered[key];
  }
  return "";
}

function parseCsvStatement(buffer) {
  const rows = parse(buffer.toString("utf8"), { columns: true, trim: true, skip_empty_lines: true });
  return rows.map((row) => ({
    rawDate: pick(row, ["date", "transaction date", "posted date"]),
    rawDescription: pick(row, ["description", "memo", "details", "name"]),
    rawAmount: pick(row, ["amount", "debit", "credit", "transaction amount"]),
    rawMerchant: pick(row, ["merchant", "payee"]),
    raw: row,
  }));
}

module.exports = { parseCsvStatement };
