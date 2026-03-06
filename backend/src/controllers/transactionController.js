const { supabaseAdmin } = require("../services/supabaseService");

async function listTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { from, to, category } = req.query;
    let query = supabaseAdmin.from("transactions").select("*").eq("user_id", userId).order("transaction_date", { ascending: false }).limit(500);
    if (from) query = query.gte("transaction_date", from);
    if (to) query = query.lt("transaction_date", to);
    if (category) query = query.eq("category_name", category);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data: data || [] });
  } catch (err) {
    next(err);
  }
}

async function updateTransactionCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ error: "categoryName is required" });
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .update({ category_name: categoryName })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTransactions, updateTransactionCategory };
