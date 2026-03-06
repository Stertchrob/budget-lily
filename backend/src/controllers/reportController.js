const { supabaseAdmin } = require("../services/supabaseService");
const { getDateRange, computeOverview } = require("../services/analyticsService");

async function getOverviewReport(req, res, next) {
  try {
    const { from, to, month } = getDateRange(req.query.month);
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("transaction_date,amount,merchant,category_name")
      .eq("user_id", req.user.id)
      .gte("transaction_date", from)
      .lt("transaction_date", to);
    if (error) throw error;
    res.json({ month, ...computeOverview(data || []) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOverviewReport };
