function normalizeMerchant(rawMerchant, rawDescription) {
  return String(rawMerchant || rawDescription || "")
    .toLowerCase()
    .replace(/\d{2,}/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

module.exports = { normalizeMerchant };
