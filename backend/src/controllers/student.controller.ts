import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User.model"; // adapte le chemin si différent

export async function getStudentProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user._id).select(
      "username email fullName phone country nationality dateOfBirth role"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ profile: user });
  } catch (err: any) {
    console.error("getStudentProfile error:", err);
    return res.status(500).json({ message: "Server error", error: err?.message });
  }
}

export async function updateStudentProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authenticated" });

    const { fullName, username, phone, country, nationality, dateOfBirth } = req.body || {};

    const updates: any = {};
    if (typeof fullName === "string") updates.fullName = fullName.trim();
    if (typeof username === "string") updates.username = username.trim();
    if (typeof phone === "string") updates.phone = phone.trim();
    if (typeof country === "string") updates.country = country.trim();
    if (typeof nationality === "string") updates.nationality = nationality.trim();
    if (typeof dateOfBirth === "string") updates.dateOfBirth = dateOfBirth.trim();

    // email = non modifiable ici (tu l’as mis editable={false} dans l’app)
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("username email fullName phone country nationality dateOfBirth role");

    return res.json({ profile: user });
  } catch (err: any) {
    console.error("updateStudentProfile error:", err);
    return res.status(500).json({ message: "Server error", error: err?.message });
  }
}
