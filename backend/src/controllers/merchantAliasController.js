const { listUnnamedMerchants, listAliases, createAlias, deleteAlias } = require("../services/merchantAliasService");

async function getUnnamed(req, res, next) {
  try {
    const merchants = await listUnnamedMerchants(req.user.id);
    res.json({ data: merchants });
  } catch (err) {
    next(err);
  }
}

async function getAliases(req, res, next) {
  try {
    const aliases = await listAliases(req.user.id);
    res.json({ data: aliases });
  } catch (err) {
    next(err);
  }
}

async function addAlias(req, res, next) {
  try {
    const { original, display } = req.body;
    if (!original?.trim() || !display?.trim()) {
      return res.status(400).json({ error: "original and display are required" });
    }
    const data = await createAlias(req.user.id, original.trim(), display.trim());
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

async function removeAlias(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "alias id is required" });
    await deleteAlias(req.user.id, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getUnnamed, getAliases, addAlias, removeAlias };
