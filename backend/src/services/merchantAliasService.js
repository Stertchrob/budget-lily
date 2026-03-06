const { supabaseAdmin } = require("../services/supabaseService");

async function getAliasMap(userId) {
  const { data, error } = await supabaseAdmin
    .from("merchant_aliases")
    .select("original_merchant, display_name")
    .eq("user_id", userId);
  if (error) throw error;
  const map = {};
  for (const row of data || []) {
    map[row.original_merchant] = row.display_name;
  }
  return map;
}

function applyAliases(items, aliasMap) {
  if (!aliasMap || Object.keys(aliasMap).length === 0) return items;
  return items.map((item) => {
    const m = item.merchant || "Unknown";
    const display = aliasMap[m] || m;
    return { ...item, merchant: display };
  });
}

async function listUnnamedMerchants(userId) {
  const { data: txns, error: txnError } = await supabaseAdmin
    .from("transactions")
    .select("merchant")
    .eq("user_id", userId);
  if (txnError) throw txnError;

  const { data: aliases, error: aliasError } = await supabaseAdmin
    .from("merchant_aliases")
    .select("original_merchant")
    .eq("user_id", userId);
  if (aliasError) throw aliasError;

  const aliasedSet = new Set((aliases || []).map((a) => a.original_merchant));
  const merchants = new Set();
  for (const t of txns || []) {
    const m = (t.merchant || "").trim();
    if (m && !aliasedSet.has(m)) merchants.add(m);
  }
  return Array.from(merchants).sort();
}

async function listAliases(userId) {
  const { data, error } = await supabaseAdmin
    .from("merchant_aliases")
    .select("id, original_merchant, display_name")
    .eq("user_id", userId)
    .order("display_name");
  if (error) throw error;
  return data || [];
}

async function createAlias(userId, originalMerchant, displayName) {
  const { data, error } = await supabaseAdmin
    .from("merchant_aliases")
    .upsert(
      { user_id: userId, original_merchant: originalMerchant.trim(), display_name: displayName.trim() },
      { onConflict: "user_id, original_merchant" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteAlias(userId, aliasId) {
  const { error } = await supabaseAdmin
    .from("merchant_aliases")
    .delete()
    .eq("id", aliasId)
    .eq("user_id", userId);
  if (error) throw error;
}

module.exports = {
  getAliasMap,
  applyAliases,
  listUnnamedMerchants,
  listAliases,
  createAlias,
  deleteAlias,
};
