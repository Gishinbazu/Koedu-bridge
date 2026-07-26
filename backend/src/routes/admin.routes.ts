// src/routes/admin.routes.ts
import { Router } from "express";
import { getAdminMetrics } from "../controllers/admin.controller";
import {
  exportApplicationsCsv,
  updateApplicationStatus,
} from "../controllers/adminApplicationController";
import {
  getAllApplicationsAdmin,
  getApplicationById,
} from "../controllers/application.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

// ✅ protect all admin routes
router.use(requireAuth, requireAdmin);

/* =========================
   DASHBOARD METRICS
   GET /api/admin/metrics
   ========================= */
router.get("/metrics", getAdminMetrics);

/* =========================
   APPLICATIONS ADMIN
   /api/admin/applications/...
   ========================= */
router.get("/applications/export", exportApplicationsCsv);
router.get("/applications", getAllApplicationsAdmin);
router.get("/applications/:id", getApplicationById);
router.patch("/applications/:id/status", updateApplicationStatus);

export default router;
