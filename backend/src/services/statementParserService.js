const path = require("path");
const { parseCsvStatement } = require("./csvParserService");

async function parseStatement(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = file.mimetype || "";
  if (ext === ".pdf" || mime.includes("pdf")) {
    const err = new Error("PDF uploads are not supported. Please use a CSV file.");
    err.status = 400;
    throw err;
  }
  if (ext === ".csv" || mime.includes("csv") || mime.includes("text/plain")) return parseCsvStatement(file.buffer);
  const err = new Error("Unsupported file type. Only CSV files are accepted.");
  err.status = 400;
  throw err;
}

module.exports = { parseStatement };
