const path = require("path");
const { parseCsvStatement } = require("./csvParserService");
const { parsePdfStatement } = require("./pdfParserService");

async function parseStatement(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = file.mimetype || "";
  if (ext === ".csv" || mime.includes("csv") || mime.includes("text/plain")) return parseCsvStatement(file.buffer);
  if (ext === ".pdf" || mime.includes("pdf")) return parsePdfStatement(file.buffer);
  const err = new Error("Unsupported file type");
  err.status = 400;
  throw err;
}

module.exports = { parseStatement };
