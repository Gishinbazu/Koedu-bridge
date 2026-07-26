// src/controllers/user.controller.ts
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User.model";

/* -------------------- PROFIL -------------------- */

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { fullName, phone, country } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, country },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    const user: any = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // on compare avec user.password (hash stocké dans le modèle)
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

/* -------------------- SETTINGS -------------------- */

export const getMySettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("settings");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings || {});
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

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings || {});
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

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings || {});
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

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings || {});
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
