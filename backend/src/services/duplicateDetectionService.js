function fingerprint(txn) {
  return [txn.transaction_date, txn.amount.toFixed(2), txn.merchant || "", txn.description.toLowerCase()].join("|");
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

module.exports = { dedupeTransactions };
