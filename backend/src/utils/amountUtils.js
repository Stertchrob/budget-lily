function parseAmount(value) {
  const raw = String(value ?? "").replace(/[^0-9.-]/g, "");
  const amount = Number.parseFloat(raw);
  return Number.isFinite(amount) ? amount : 0;
}

module.exports = { parseAmount };
