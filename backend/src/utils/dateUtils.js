function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  const m = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  const year = m[3].length === 2 ? `20${m[3]}` : m[3];
  const normalized = new Date(`${year}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`);
  return Number.isNaN(normalized.getTime()) ? null : normalized.toISOString().slice(0, 10);
}

module.exports = { parseDate };
