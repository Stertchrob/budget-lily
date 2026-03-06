const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listTransactions, updateTransactionCategory } = require("../controllers/transactionController");

const router = express.Router();
router.get("/", authMiddleware, listTransactions);
router.patch("/:id/category", authMiddleware, updateTransactionCategory);

module.exports = router;
