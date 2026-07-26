// src/controllers/adminAccountController.ts
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export async function getAdminMe(req: Request, res: Response) {
  const user = (req as any).adminUser;
  if (!user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  return res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      organization: user.organization,
      country: user.country,
      language: user.language,
      timezone: user.timezone,
      emailNewApp: user.emailNewApp,
      emailStatusChange: user.emailStatusChange,
      emailWeeklySummary: user.emailWeeklySummary,
      inAppAlerts: user.inAppAlerts,
    },
  });
}

export async function updateAdminProfile(req: Request, res: Response) {
  const admin = (req as any).adminUser;
  if (!admin) return res.status(401).json({ message: "Not authenticated." });

  const { name, username, email, phone, organization } = req.body;

  if (name) admin.username = name; // tu peux séparer name/username si tu veux
  if (username) admin.username = username;
  if (email) admin.email = email;
  if (phone !== undefined) admin.phone = phone;
  if (organization !== undefined) admin.organization = organization;

  await admin.save();

  return res.json({
    message: "Profile updated",
    user: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      phone: admin.phone,
      organization: admin.organization,
    },
  });
}

export async function getAdminPreferences(req: Request, res: Response) {
  const admin = (req as any).adminUser;
  if (!admin) return res.status(401).json({ message: "Not authenticated." });

  return res.json({
    preferences: {
      emailNewApp: admin.emailNewApp,
      emailStatusChange: admin.emailStatusChange,
      emailWeeklySummary: admin.emailWeeklySummary,
      inAppAlerts: admin.inAppAlerts,
      country: admin.country,
      language: admin.language,
      timezone: admin.timezone,
    },
  });
}

export async function updateAdminPreferences(req: Request, res: Response) {
  const admin = (req as any).adminUser;
  if (!admin) return res.status(401).json({ message: "Not authenticated." });

  const {
    emailNewApp,
    emailStatusChange,
    emailWeeklySummary,
    inAppAlerts,
    country,
    language,
    timezone,
  } = req.body;

  if (emailNewApp !== undefined) admin.emailNewApp = !!emailNewApp;
  if (emailStatusChange !== undefined)
    admin.emailStatusChange = !!emailStatusChange;
  if (emailWeeklySummary !== undefined)
    admin.emailWeeklySummary = !!emailWeeklySummary;
  if (inAppAlerts !== undefined) admin.inAppAlerts = !!inAppAlerts;

  if (country !== undefined) admin.country = country;
  if (language !== undefined) admin.language = language;
  if (timezone !== undefined) admin.timezone = timezone;

  await admin.save();

  return res.json({
    message: "Preferences updated",
    preferences: {
      emailNewApp: admin.emailNewApp,
      emailStatusChange: admin.emailStatusChange,
      emailWeeklySummary: admin.emailWeeklySummary,
      inAppAlerts: admin.inAppAlerts,
      country: admin.country,
      language: admin.language,
      timezone: admin.timezone,
    },
  });
}

export async function changeAdminPassword(req: Request, res: Response) {
  const admin = (req as any).adminUser;
  if (!admin) return res.status(401).json({ message: "Not authenticated." });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "currentPassword and newPassword are required." });
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword, salt);
  await admin.save();

  return res.json({ message: "Password changed successfully." });
}
