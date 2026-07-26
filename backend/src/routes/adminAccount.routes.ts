// src/routes/adminAccount.routes.ts
import { Router } from "express";
import {
    changeAdminPassword,
    getAdminMe,
    getAdminPreferences,
    updateAdminPreferences,
    updateAdminProfile,
} from "../controllers/adminAccountController";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Toutes les routes sont protégées: requireAuth + requireAdmin
router.use(requireAuth as any, requireAdmin as any);

router.get("/me", getAdminMe);
router.patch("/account", updateAdminProfile);
router.get("/preferences", getAdminPreferences);
router.patch("/preferences", updateAdminPreferences);
router.post("/change-password", changeAdminPassword);

export default router;
