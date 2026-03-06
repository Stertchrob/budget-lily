const { DEFAULT_CATEGORY_RULES } = require("../utils/categoryRules");

function categorizeTransaction(txn) {
  if (txn.amount > 0) return "Income";
  const text = `${txn.merchant || ""} ${txn.description || ""}`.toLowerCase();
  const matched = DEFAULT_CATEGORY_RULES.find((rule) => rule.keywords.some((k) => text.includes(k)));
  return matched ? matched.category : "Other";
}

module.exports = { categorizeTransaction };
