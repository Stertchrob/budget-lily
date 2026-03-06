const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listCategories, createCategory } = require("../controllers/categoryController");

const router = express.Router();
router.get("/", authMiddleware, listCategories);
router.post("/", authMiddleware, createCategory);

module.exports = router;
