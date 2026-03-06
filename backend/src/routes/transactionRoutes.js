const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listTransactions, updateTransactionCategory, deleteTransaction, toggleTransactionReviewed } = require("../controllers/transactionController");

const router = express.Router();
router.get("/", authMiddleware, listTransactions);
router.patch("/:id/toggle-reviewed", authMiddleware, toggleTransactionReviewed);
router.patch("/:id/category", authMiddleware, updateTransactionCategory);
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
