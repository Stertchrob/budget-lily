const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getOverviewReport } = require("../controllers/reportController");

const router = express.Router();
router.get("/overview", authMiddleware, getOverviewReport);

module.exports = router;
