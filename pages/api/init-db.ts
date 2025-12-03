import type { NextApiRequest, NextApiResponse } from "next";
import { initDb } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await initDb();
    res.json({ message: "Database initialized" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error initializing database" });
  }
}

