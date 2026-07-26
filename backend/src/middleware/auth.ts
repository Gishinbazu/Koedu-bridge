// middleware/auth.ts
import { Request, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User.model";

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

export interface AuthRequest extends Request {
  user?: any;
}

interface TokenPayload extends JwtPayload {
  userId: string;
}

// ✅ typed as Express RequestHandler (fix TS red lines in routes)
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!payload?.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as AuthRequest).user = user;
    return next();
  } catch (e) {
    console.error("[requireAuth] error:", e);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  return next();
};
