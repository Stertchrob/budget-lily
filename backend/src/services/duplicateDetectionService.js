function fingerprint(txn) {
  const amount = Number(txn.amount || 0).toFixed(2);
  const merchant = String(txn.merchant || "").trim().toLowerCase();
  const description = String(txn.description || "").trim().toLowerCase();
  return [txn.transaction_date, amount, merchant, description].join("|");
}

function dedupeTransactions(transactions) {
  const seen = new Set();
  return transactions.filter((txn) => {
    const key = fingerprint(txn);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTransactionDateRange(transactions) {
  const dates = transactions
    .map((txn) => String(txn.transaction_date || ""))
    .filter(Boolean)
    .sort();

  if (!dates.length) return null;
  return { from: dates[0], to: dates[dates.length - 1] };
}

async function filterExistingDuplicates(supabaseAdmin, userId, transactions) {
  if (!transactions.length) {
    return { uniqueTransactions: [], skippedDuplicateCount: 0 };
  }

  const dateRange = getTransactionDateRange(transactions);
  if (!dateRange) {
    return { uniqueTransactions: transactions, skippedDuplicateCount: 0 };
  }

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("transaction_date,amount,merchant,description")
    .eq("user_id", userId)
    .gte("transaction_date", dateRange.from)
    .lte("transaction_date", dateRange.to);

  if (error) throw error;

  const existingFingerprints = new Set((data || []).map(fingerprint));
  let skippedDuplicateCount = 0;

  const uniqueTransactions = transactions.filter((txn) => {
    const key = fingerprint(txn);
    if (existingFingerprints.has(key)) {
      skippedDuplicateCount += 1;
      return false;
    }
    existingFingerprints.add(key);
    return true;
  });

  return { uniqueTransactions, skippedDuplicateCount };
}

module.exports = { dedupeTransactions, filterExistingDuplicates };
