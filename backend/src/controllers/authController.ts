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

/* ==========================================================
   REGISTER USER (Student)
   POST /api/auth/register
   ========================================================== */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }

    const emailClean = email.trim().toLowerCase();
    const usernameClean = username.trim();

    const existing = await User.findOne({ email: emailClean });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user: any = await User.create({
      username: usernameClean,
      email: emailClean,
      password: hashed,
      role: "student",
    });

    const token = createToken(user._id.toString(), user.role || "student");

    console.log("✅ Inscription réussie pour :", user.email);

    return res.status(201).json({
      success: true,
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

/* ==========================================================
   LOGIN USER
   POST /api/auth/login
   ========================================================== */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // 1. Nettoyage de l'email pour éviter les soucis de casse
    const emailClean = email.trim().toLowerCase();

    // 2. Recherche avec sélection forcée du champ password (même s'il est masqué dans le schéma)
    const user: any = await User.findOne({ email: emailClean }).select(
      "+password",
    );

    if (!user) {
      console.warn("⚠️ Connexion échouée : Email non trouvé ->", emailClean);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const storedHash: string | undefined = user.password || user.passwordHash;

    if (!storedHash) {
      console.error("⚠️ Mot de passe absent pour l'utilisateur :", emailClean);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Comparaison sécurisée du hash avec bcrypt
    const match = await bcrypt.compare(password, storedHash);

    if (!match) {
      console.warn(
        "⚠️ Connexion échouée : Mot de passe incorrect pour ->",
        emailClean,
      );
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Génération du jeton JWT
    const token = createToken(user._id.toString(), user.role || "student");

    console.log("✅ Connexion réussie pour :", user.email);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("❌ Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/* ==========================================================
   GET CURRENT USER
   GET /api/auth/me
   ========================================================== */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Récupération souple de l'ID depuis req.user
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId).select(
      "_id username email role createdAt",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error: any) {
    console.error("getMe error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
