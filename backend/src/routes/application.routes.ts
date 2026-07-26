// src/routes/application.routes.ts
import { Router } from "express";
import {
  createApplication,
  getAllApplicationsAdmin,
  getApplicationById,
  getApplicationByKoeduIdForStudent,
  getMyApplications,
  submitApplicationByKoeduForStudent,
  updateApplicationByKoeduForStudent,
} from "../controllers/application.controller";

import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

/* ================================
   STUDENT ROUTES
   ================================ */
router.post("/", requireAuth, createApplication);
router.get("/my", requireAuth, getMyApplications);
router.get("/by-koedu/:koeduId", requireAuth, getApplicationByKoeduIdForStudent);
router.put("/by-koedu/:koeduId", requireAuth, updateApplicationByKoeduForStudent);
router.patch("/by-koedu/:koeduId/submit", requireAuth, submitApplicationByKoeduForStudent);

/* ================================
   ADMIN ROUTES (legacy)
   ================================ */
router.get("/admin", requireAuth, requireAdmin, getAllApplicationsAdmin);
router.get("/admin/:id", requireAuth, requireAdmin, getApplicationById);

export default router;
