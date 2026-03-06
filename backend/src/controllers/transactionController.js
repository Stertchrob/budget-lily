const { supabaseAdmin } = require("../services/supabaseService");
const { getAliasMap, applyAliases } = require("../services/merchantAliasService");

async function listTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { from, to, category, batch } = req.query;
    let query = supabaseAdmin.from("transactions").select("*").eq("user_id", userId).order("transaction_date", { ascending: false }).limit(500);
    if (from) query = query.gte("transaction_date", from);
    if (to) query = query.lt("transaction_date", to);
    if (category) query = query.eq("category_name", category);
    if (batch) query = query.eq("statement_upload_id", batch);
    const [aliasMap, { data, error }] = await Promise.all([getAliasMap(userId), query]);
    if (error) throw error;
    const txns = applyAliases(data || [], aliasMap);
    res.json({ data: txns });
  } catch (err) {
    next(err);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function toggleTransactionReviewed(req, res, next) {
  try {
    const { id } = req.params;
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("transactions")
      .select("category_edited")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();
    if (fetchError || !existing) return res.status(404).json({ error: "Transaction not found" });
    const newValue = !existing.category_edited;
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .update({ category_edited: newValue })
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

async function updateTransactionCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ error: "categoryName is required" });
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .update({ category_name: categoryName, category_edited: true })
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

module.exports = { listTransactions, updateTransactionCategory, deleteTransaction, toggleTransactionReviewed };
