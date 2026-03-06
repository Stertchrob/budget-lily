const path = require("path");
const { v4: uuid } = require("uuid");
const { supabaseAdmin } = require("../services/supabaseService");
const { parseStatement } = require("../services/statementParserService");
const { normalizeTransactions } = require("../services/transactionNormalizationService");
const { dedupeTransactions } = require("../services/duplicateDetectionService");
const { categorizeTransaction } = require("../services/categorizationService");
const { getReviewedMerchantCategoryMap } = require("../services/reviewedMerchantCategoryService");

async function uploadStatement(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });
    const userId = req.user.id;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "statements";
    const ext = path.extname(req.file.originalname || ".csv") || ".csv";
    const storagePath = `${userId}/${Date.now()}-${uuid()}${ext}`;

    const uploaded = await supabaseAdmin.storage.from(bucket).upload(storagePath, req.file.buffer, {
      contentType: req.file.mimetype || "application/octet-stream",
      upsert: false,
    });
    if (uploaded.error) throw uploaded.error;

    const batchName = req.file.originalname || "Statement";
    const statement = await supabaseAdmin
      .from("statement_uploads")
      .insert({ user_id: userId, file_name: req.file.originalname, name: batchName, storage_path: storagePath, mime_type: req.file.mimetype })
      .select()
      .single();
    if (statement.error) throw statement.error;

    const parsed = await parseStatement(req.file);
    let normalized = dedupeTransactions(normalizeTransactions(parsed));

    const statementType = (req.body?.statementType || "debit").toLowerCase();
    if (statementType === "credit") {
      normalized = normalized.map((txn) => ({ ...txn, amount: -txn.amount }));
    }

    const reviewedCategoryMap = await getReviewedMerchantCategoryMap(
      userId,
      normalized.map((txn) => txn.merchant)
    );

    const rows = normalized.map((txn) => {
      const reviewedCategory = reviewedCategoryMap[txn.merchant];
      return {
        user_id: userId,
        statement_upload_id: statement.data.id,
        transaction_date: txn.transaction_date,
        amount: txn.amount,
        merchant: txn.merchant,
        description: txn.description,
        category_name: reviewedCategory || categorizeTransaction(txn),
        category_edited: Boolean(reviewedCategory),
        raw_payload: txn.raw_payload,
      };
    });

    if (rows.length) {
      const inserted = await supabaseAdmin.from("transactions").insert(rows);
      if (inserted.error) throw inserted.error;
    }

    res.status(201).json({
      message: "Statement uploaded and processed",
      parsedCount: parsed.length,
      insertedCount: rows.length,
      statementUploadId: statement.data.id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadStatement };
