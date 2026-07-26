import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { Program } from "../models/Program";

const router = Router();

// --- Configuration de Multer pour le stockage des PDF ---
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `program-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF sont autorisés !"));
    }
  },
});

/* =========================================
   GET / (Liste des programmes)
   Ex: GET /api/programs ou GET /api/admin/programs
   ========================================= */
router.get("/", async (_req, res) => {
  try {
    const programs = await Program.find();
    res.json({ success: true, programs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* =========================================
   POST / (Création de programme avec PDF)
   Ex: POST /api/admin/programs
   ========================================= */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.single("pdf"),
  async (req, res) => {
    try {
      console.log("👉 Request Body:", req.body);
      console.log("👉 Uploaded File:", req.file);

      const { title, name, university, type, pdfUrl } = req.body;
      const programName = name || title;

      if (!programName || !university) {
        return res.status(400).json({
          success: false,
          message: "Program name and university are required.",
        });
      }

      const finalPdfUrl = req.file
        ? `/uploads/${req.file.filename}`
        : pdfUrl || "";

      const newProgram = await Program.create({
        name: programName,
        title: programName,
        university,
        type: type || "bachelor",
        pdfUrl: finalPdfUrl,
      });

      res.status(201).json({ success: true, program: newProgram });
    } catch (error: any) {
      console.error("❌ Program Creation Error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      }

      res.status(500).json({ success: false, error: error.message });
    }
  },
);

/* =========================================
   PUT /:id (Modification de programme avec PDF)
   Ex: PUT /api/admin/programs/:id
   ========================================= */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, name, university, type, pdfUrl } = req.body;
      const programName = name || title;

      const updateData: any = {
        name: programName,
        title: programName,
        university,
        type,
      };

      if (req.file) {
        updateData.pdfUrl = `/uploads/${req.file.filename}`;
      } else if (pdfUrl !== undefined) {
        updateData.pdfUrl = pdfUrl;
      }

      const updatedProgram = await Program.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedProgram) {
        return res
          .status(404)
          .json({ success: false, message: "Program not found" });
      }

      res.json({ success: true, program: updatedProgram });
    } catch (error: any) {
      console.error("❌ Program Update Error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      }

      res.status(500).json({ success: false, error: error.message });
    }
  },
);

/* =========================================
   DELETE /:id (Suppression de programme)
   Ex: DELETE /api/admin/programs/:id
   ========================================= */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProgram = await Program.findByIdAndDelete(id);

    if (!deletedProgram) {
      return res
        .status(404)
        .json({ success: false, message: "Program not found" });
    }

    res.json({ success: true, message: "Program deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
