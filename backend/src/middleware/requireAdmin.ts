// src/middleware/requireAdmin.ts
import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId || (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select(
      "username email role phone organization emailNewApp emailStatusChange emailWeeklySummary inAppAlerts country language timezone"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // On met user dans req pour les controllers
    (req as any).adminUser = user;
    next();
  } catch (err) {
    console.error("requireAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
