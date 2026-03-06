const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUnnamed, getAliases, addAlias, removeAlias } = require("../controllers/merchantAliasController");

const router = express.Router();
router.get("/unnamed", authMiddleware, getUnnamed);
router.get("/", authMiddleware, getAliases);
router.post("/", authMiddleware, addAlias);
router.delete("/:id", authMiddleware, removeAlias);

module.exports = router;
