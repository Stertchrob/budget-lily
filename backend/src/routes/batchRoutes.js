const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listBatches, renameBatch, deleteBatch } = require("../controllers/batchController");

const router = express.Router();
router.get("/", authMiddleware, listBatches);
router.patch("/:id", authMiddleware, renameBatch);
router.delete("/:id", authMiddleware, deleteBatch);

module.exports = router;
