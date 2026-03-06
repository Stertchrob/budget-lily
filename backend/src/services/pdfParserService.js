async function parsePdfStatement() {
  const err = new Error("PDF parsing is not enabled yet. Please upload CSV.");
  err.status = 400;
  throw err;
}

module.exports = { parsePdfStatement };
