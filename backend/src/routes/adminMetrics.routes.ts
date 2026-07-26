// src/routes/adminMetrics.routes.ts
import { Router } from "express";
import {
    getAdminMetrics,
    upsertAdminMetrics,
} from "../controllers/adminMetricsController";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

/**
 * Toutes les routes /api/admin/metrics
 * sont protégées par authentification + rôle admin
 */
router.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/metrics
 * → Renvoie les KPI stockés dans MongoDB
 */
router.get("/", getAdminMetrics);

/**
 * PUT /api/admin/metrics
 * → Met à jour / crée les KPI (pour l’écran /admin/edit-stats)
 */
router.put("/", upsertAdminMetrics);

export default router;
