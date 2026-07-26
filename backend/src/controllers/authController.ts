// src/controllers/authController.ts
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User.model";

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

const createToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

// ------------------- REGISTER -------------------
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user: any = await User.create({
      username,
      email,
      password: hashed,
      role: "student",
    });

    const token = createToken(user._id.toString(), user.role || "student");

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user: any = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    const storedHash: string | undefined =
      user.password || user.passwordHash;

    if (!storedHash) {
      console.error("User has no password hash stored", {
        id: user._id,
        email: user.email,
      });
      return res
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, storedHash);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id.toString(), user.role || "student");

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ------------------- GET /api/auth/me -------------------
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ ton middleware met probablement `req.user.id`
    const user = await User.findById(req.user.id).select(
      "_id username email role createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error: any) {
    console.error("getMe error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
