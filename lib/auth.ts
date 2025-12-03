import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  email: string;
}

export function verifyToken(req: NextApiRequest): UserPayload | null {
  const header = req.headers["authorization"];
  if (!header) {
    return null;
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    ) as UserPayload;
    return { id: payload.id, email: payload.email };
  } catch (err) {
    return null;
  }
}

