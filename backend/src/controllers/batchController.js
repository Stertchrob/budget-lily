const { supabaseAdmin } = require("../services/supabaseService");

async function listBatches(req, res, next) {
  try {
    const userId = req.user.id;
    const { data: batches, error } = await supabaseAdmin
      .from("statement_uploads")
      .select("id, file_name, name, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const withCounts = await Promise.all(
      (batches || []).map(async (b) => {
        const { count } = await supabaseAdmin
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("statement_upload_id", b.id);
        return { ...b, displayName: b.name || b.file_name, transactionCount: count || 0 };
      })
    );

    res.json({ data: withCounts });
  } catch (err) {
    next(err);
  }
}

async function renameBatch(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: "name is required" });

    const { data, error } = await supabaseAdmin
      .from("statement_uploads")
      .update({ name: String(name).trim() })
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

async function deleteBatch(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error: txError } = await supabaseAdmin
      .from("transactions")
      .delete()
      .eq("statement_upload_id", id)
      .eq("user_id", userId);
    if (txError) throw txError;

    const { error: batchError } = await supabaseAdmin
      .from("statement_uploads")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (batchError) throw batchError;

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listBatches, renameBatch, deleteBatch };
