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
import { Program } from "../models/Program"; // Importation du modèle Program

const router = Router();

// ✅ Protect all admin routes automatically
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

/* =========================
   PROGRAMS MANAGEMENT ADMIN
   /api/admin/programs/...
   ========================= */

// POST /api/admin/programs - Créer un programme
router.post("/programs", async (req, res) => {
  try {
    const { title, university, type } = req.body;
    const newProgram = await Program.create({ title, university, type });
    res.status(201).json({ success: true, program: newProgram });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/programs/:id - Modifier un programme
router.put("/programs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, university, type } = req.body;
    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      { title, university, type },
      { new: true },
    );
    res.json({ success: true, program: updatedProgram });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/programs/:id - Supprimer un programme
router.delete("/programs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Program.findByIdAndDelete(id);
    res.json({ success: true, message: "Program deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
