const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );

    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const result = await query("SELECT id, email, password_hash FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


