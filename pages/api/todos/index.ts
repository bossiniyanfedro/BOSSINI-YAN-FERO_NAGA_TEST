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

  if (req.method === "GET") {
    try {
      const result = await query(
        "SELECT id, title, description, is_done, user_id, created_at FROM todos WHERE user_id = $1 ORDER BY id DESC",
        [user.id]
      );
      res.json({ todos: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Title wajib diisi" });
      }

      const result = await query(
        "INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING id, title, description, is_done, user_id, created_at",
        [title, description || null, user.id]
      );

      res.status(201).json({ todo: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

