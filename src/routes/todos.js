const express = require("express");
const { query } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// All route wajib login
router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await query(
      "SELECT id, title, description, is_done, user_id, created_at FROM todos WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );
    res.json({ todos: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title wajib diisi" });
    }

    const result = await query(
      "INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING id, title, description, is_done, user_id, created_at",
      [title, description || null, userId]
    );

    res.status(201).json({ todo: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const result = await query(
      "SELECT id, title, description, is_done, user_id, created_at FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo tidak ditemukan" });
    }

    res.json({ todo: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    const { title, description, is_done } = req.body;

    const result = await query(
      "UPDATE todos SET title = $1, description = $2, is_done = $3 WHERE id = $4 AND user_id = $5 RETURNING id, title, description, is_done, user_id, created_at",
      [title, description || null, Boolean(is_done), id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo tidak ditemukan atau bukan milik user" });
    }

    res.json({ todo: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const result = await query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo tidak ditemukan atau bukan milik user" });
    }

    res.json({ message: "Todo terhapus" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


