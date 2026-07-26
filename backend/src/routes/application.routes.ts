import { Router } from "express";
import {
   createApplication,
   getAllApplicationsAdmin,
   getApplicationById,
   getApplicationByIdOrKoeduId,
   getApplicationByKoeduIdForStudent,
   getMyApplications,
   submitApplicationByKoeduForStudent,
   updateApplicationByIdOrKoeduId,
   updateApplicationByKoeduForStudent,
} from "../controllers/application.controller";

import { requireAdmin, requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload"; // Middleware Multer

const router = Router();

// Configuration des champs de fichiers acceptés
const cpUpload = upload.fields([
  { name: "passport", maxCount: 1 },
  { name: "transcript", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
  { name: "familyCertificate", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]);

/* ================================
   STUDENT ROUTES
   ================================ */
router.post("/", requireAuth, createApplication);
router.get("/my", requireAuth, getMyApplications);

// Routes spécifiques koeduId
router.get(
  "/by-koedu/:koeduId",
  requireAuth,
  getApplicationByKoeduIdForStudent,
);
router.put(
  "/by-koedu/:koeduId",
  requireAuth,
  cpUpload,
  updateApplicationByKoeduForStudent,
);
router.patch(
  "/by-koedu/:koeduId/submit",
  requireAuth,
  submitApplicationByKoeduForStudent,
);

/* ================================
   UNIVERSAL ROUTES (Smart Routes)
   ================================ */
router.get("/:id", requireAuth, getApplicationByIdOrKoeduId);

// 🚀 La route PUT prend désormais le middleware Multer `cpUpload`
router.put("/:id", requireAuth, cpUpload, updateApplicationByIdOrKoeduId);

/* ================================
   ADMIN ROUTES
   ================================ */
router.get("/admin", requireAuth, requireAdmin, getAllApplicationsAdmin);
router.get("/admin/:id", requireAuth, requireAdmin, getApplicationById);

export default router;
