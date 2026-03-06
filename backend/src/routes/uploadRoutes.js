const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadStatement } = require("../controllers/uploadController");

const router = express.Router();
router.post("/statements", authMiddleware, upload.single("statement"), uploadStatement);

module.exports = router;
