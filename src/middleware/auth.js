const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Format token salah" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

module.exports = authMiddleware;


