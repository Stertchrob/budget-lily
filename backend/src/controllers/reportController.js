const { supabaseAdmin } = require("../services/supabaseService");
const { getDateRange, computeOverview } = require("../services/analyticsService");
const { getAliasMap, applyAliases } = require("../services/merchantAliasService");

async function getOverviewReport(req, res, next) {
  try {
    const userId = req.user.id;
    const { from, to, month } = getDateRange(req.query.month);
    const [aliasMap, { data, error }] = await Promise.all([
      getAliasMap(userId),
      supabaseAdmin
        .from("transactions")
        .select("transaction_date,amount,merchant,category_name")
        .eq("user_id", userId)
        .gte("transaction_date", from)
        .lt("transaction_date", to),
    ]);
    if (error) throw error;
    const txns = applyAliases(data || [], aliasMap);
    res.json({ month, ...computeOverview(txns, month) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOverviewReport };
