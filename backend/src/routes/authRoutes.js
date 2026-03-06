const express = require("express");
const router = express.Router();

router.get("/status", (req, res) => {
  res.json({ message: "Auth is handled by Supabase in frontend." });
});

module.exports = router;
