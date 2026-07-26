// src/routes/program.routes.ts
import { Router } from "express";
import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  updateProgram,
} from "../controllers/program.controller"; // ← bien vérifier ce chemin

const router = Router();

// GET /api/programs
router.get("/", getPrograms);

// GET /api/programs/:id
router.get("/:id", getProgramById);

// POST /api/programs
router.post("/", createProgram);

// PUT /api/programs/:id
router.put("/:id", updateProgram);

// DELETE /api/programs/:id
router.delete("/:id", deleteProgram);

export default router;
