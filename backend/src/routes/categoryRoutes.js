const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listCategories, createCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();
router.get("/", authMiddleware, listCategories);
router.post("/", authMiddleware, createCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
