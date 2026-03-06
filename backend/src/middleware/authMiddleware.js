const { supabaseAdmin } = require("../services/supabaseService");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  return next();
}

module.exports = authMiddleware;
