// src/controllers/admin.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Application } from "../models/Application";
import User from "../models/User.model";

export async function getAdminMetrics(_req: AuthRequest, res: Response) {
  try {
    const [totalUsers, totalApplications] = await Promise.all([
      User.countDocuments(),
      Application.countDocuments(),
    ]);

    const byStatusAgg = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byTypeAgg = await Application.aggregate([
      { $group: { _id: "$programType", count: { $sum: 1 } } },
    ]);

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const last7Days = await Application.countDocuments({
      createdAt: { $gte: since },
    });

    const byStatus: Record<string, number> = {};
    byStatusAgg.forEach((x: any) => {
      byStatus[x?._id || "unknown"] = x?.count || 0;
    });

    const byType: Record<string, number> = {};
    byTypeAgg.forEach((x: any) => {
      byType[x?._id || "unknown"] = x?.count || 0;
    });

    return res.json({
      totalUsers,
      totalApplications,
      last7Days,
      byStatus,
      byType,
    });
  } catch (err: any) {
    console.error("getAdminMetrics error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err?.message,
    });
  }
}
