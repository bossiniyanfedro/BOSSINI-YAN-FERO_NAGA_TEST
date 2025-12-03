import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = parseInt(req.query.id as string, 10);

  if (req.method === "GET") {
    try {
      const result = await query(
        "SELECT id, title, description, is_done, user_id, created_at FROM todos WHERE id = $1 AND user_id = $2",
        [id, user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Todo tidak ditemukan" });
      }

      res.json({ todo: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, description, is_done } = req.body;

      const result = await query(
        "UPDATE todos SET title = $1, description = $2, is_done = $3 WHERE id = $4 AND user_id = $5 RETURNING id, title, description, is_done, user_id, created_at",
        [title, description || null, Boolean(is_done), id, user.id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Todo tidak ditemukan atau bukan milik user" });
      }

      res.json({ todo: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await query(
        "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, user.id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Todo tidak ditemukan atau bukan milik user" });
      }

      res.json({ message: "Todo terhapus" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

