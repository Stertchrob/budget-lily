const { supabaseAdmin } = require("./supabaseService");

async function getReviewedMerchantCategoryMap(userId, merchants) {
  const uniqueMerchants = Array.from(new Set((merchants || []).map((merchant) => String(merchant || "").trim()).filter(Boolean)));
  if (!uniqueMerchants.length) return {};

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("merchant, category_name, category_edited, created_at")
    .eq("user_id", userId)
    .in("merchant", uniqueMerchants)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const categoryMap = {};
  for (const row of data || []) {
    if (!row.merchant || Object.hasOwn(categoryMap, row.merchant)) continue;
    if (row.category_edited) {
      categoryMap[row.merchant] = row.category_name;
    }
  }

  return categoryMap;
}

module.exports = { getReviewedMerchantCategoryMap };
