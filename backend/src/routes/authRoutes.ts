// src/routes/authRoutes.ts
import { Router } from "express";
import { getMe, login, register } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/register
router.post("/register", register);

// GET /api/auth/me  (user connecté)
router.get("/me", requireAuth, getMe);

export default router;
