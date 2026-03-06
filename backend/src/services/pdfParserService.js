const { PDFParse } = require("pdf-parse");

/**
 * Parse bank statement PDF text into transactions.
 * Handles common formats: date + description + amount (with optional $, commas, parentheses for negatives).
 */
function parsePdfTextToTransactions(text) {
  const rows = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // Common patterns for transaction lines:
  // - Date: MM/DD/YYYY, MM-DD-YYYY, MM/DD/YY, or Jan 15, 2024
  // - Amount: 1,234.56 or -1,234.56 or (1,234.56) or $1,234.56
  const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})/i;
  const amountPattern = /([-+]?\$?[\d,]+(?:\.\d{2})?|\(\$?[\d,]+(?:\.\d{2})?\))\s*$/;

  for (const line of lines) {
    const dateMatch = line.match(datePattern);
    const amountMatch = line.match(amountPattern);
    if (!dateMatch || !amountMatch) continue;

    const rawDate = dateMatch[1].trim();
    let rawAmount = amountMatch[1].trim();
    const descStart = dateMatch.index + dateMatch[0].length;
    const descEnd = amountMatch.index;
    const rawDescription = line.slice(descStart, descEnd).replace(/\s+/g, " ").trim();

    // Normalize amount: (1,234.56) -> -1234.56, remove $ and commas
    if (rawAmount.startsWith("(")) {
      rawAmount = "-" + rawAmount.replace(/[()$,\s]/g, "");
    } else {
      rawAmount = rawAmount.replace(/[$,\s]/g, "");
    }
    if (!rawAmount || Number.isNaN(Number.parseFloat(rawAmount))) continue;

    rows.push({
      rawDate,
      rawDescription: rawDescription || "Unknown",
      rawAmount,
      rawMerchant: rawDescription || "",
      raw: { date: rawDate, description: rawDescription, amount: rawAmount },
    });
  }

  return rows;
}

async function parsePdfStatement(buffer) {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  const text = result?.text || "";
  if (!text.trim()) {
    const err = new Error("No text could be extracted from the PDF. The file may be image-based or corrupted.");
    err.status = 400;
    throw err;
  }
  const rows = parsePdfTextToTransactions(text);
  if (rows.length === 0) {
    const err = new Error("No transactions found in PDF. The format may not be supported.");
    err.status = 400;
    throw err;
  }
  return rows;
}

module.exports = { parsePdfStatement };
