// src/controllers/user.controller.ts
import { Request, Response } from "express";
import User from "../models/User.model"; // ✅ default import


export const getMySettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("settings");
    res.json(user?.settings || {});
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const updateAccountSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { displayName, timezone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "settings.displayName": displayName,
          "settings.timezone": timezone,
        },
      },
      { new: true }
    ).select("settings");

    res.json(user.settings);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const updateNotificationSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).userId;
    const { emailUpdates, smsUpdates, marketing } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "settings.notifications.emailUpdates": emailUpdates,
          "settings.notifications.smsUpdates": smsUpdates,
          "settings.notifications.marketing": marketing,
        },
      },
      { new: true }
    ).select("settings");

    res.json(user.settings);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const updateLanguageSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { language, region } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "settings.language": language,
          "settings.region": region,
        },
      },
      { new: true }
    ).select("settings");

    res.json(user.settings);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
