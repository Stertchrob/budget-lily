const { supabaseAdmin } = require("../services/supabaseService");

async function listCategories(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("user_id", req.user.id)
      .order("name", { ascending: true });
    if (error) throw error;
    res.json({ data: data || [] });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({ user_id: req.user.id, name })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory };
