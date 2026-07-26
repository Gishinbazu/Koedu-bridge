import { Router } from "express";
import { getStudentProfile, updateStudentProfile } from "../controllers/student.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

// ✅ /api/student/profile
router.get("/profile", requireAuth, getStudentProfile);
router.patch("/profile", requireAuth, updateStudentProfile);

export default router;
