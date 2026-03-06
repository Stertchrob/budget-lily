const { parseDate } = require("../utils/dateUtils");
const { parseAmount } = require("../utils/amountUtils");
const { normalizeMerchant } = require("../utils/merchantUtils");

function normalizeTransactions(rows) {
  return rows
    .map((row) => ({
      transaction_date: parseDate(row.rawDate),
      amount: parseAmount(row.rawAmount),
      merchant: normalizeMerchant(row.rawMerchant, row.rawDescription),
      description: String(row.rawDescription || "").trim().slice(0, 500),
      raw_payload: row.raw || row,
    }))
    .filter((txn) => txn.transaction_date && txn.description);
}

module.exports = { normalizeTransactions };
