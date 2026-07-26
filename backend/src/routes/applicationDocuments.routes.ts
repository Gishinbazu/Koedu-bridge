import { Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

import { AuthRequest, requireAuth } from "../middleware/auth";
import { Application } from "../models/Application";

const router = Router();

/* ==========================================================
   UPLOAD ROOT
========================================================== */
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

const FOLDERS = {
  passport: path.join(UPLOAD_ROOT, "passport"),
  transcript: path.join(UPLOAD_ROOT, "transcript"),
  bank: path.join(UPLOAD_ROOT, "bank"),
  photo: path.join(UPLOAD_ROOT, "photo"),
  familyCertificate: path.join(UPLOAD_ROOT, "familyCertificate"),
  misc: path.join(UPLOAD_ROOT, "misc"),
};

/* ==========================================================
   ENSURE FOLDERS EXIST
========================================================== */
function ensureUploadFolders() {
  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT);
  }

  Object.values(FOLDERS).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}
ensureUploadFolders();

/* ==========================================================
   MULTER STORAGE
========================================================== */
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const field = (file.fieldname || "").toLowerCase();

    switch (field) {
      case "passport":
        return cb(null, FOLDERS.passport);
      case "transcript":
        return cb(null, FOLDERS.transcript);
      case "bank":
        return cb(null, FOLDERS.bank);
      case "photo":
        return cb(null, FOLDERS.photo);
      case "familycertificate":
        return cb(null, FOLDERS.familyCertificate);
      default:
        return cb(null, FOLDERS.misc);
    }
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext.length <= 10 ? ext : "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

/* ==========================================================
   HELPERS
========================================================== */
function publicUrlForFile(absPath: string) {
  // absPath = /.../backend/uploads/passport/xxx.png
  const rel = path.relative(path.join(process.cwd(), "uploads"), absPath); 
  // rel = passport/xxx.png
  return `/uploads/${rel}`.replace(/\\/g, "/");
}

function applyFileToApplication(app: any, field: string, file: Express.Multer.File) {
  const url = publicUrlForFile(file.path);
  const originalName = file.originalname;

  // ✅ normalise pour éviter les erreurs "familyCertificate" vs "familycertificate"
  const key = String(field || "").toLowerCase();

  if (key === "passport") {
    app.passportUrl = url;
    app.passportName = originalName;
    return;
  }

  if (key === "transcript") {
    app.transcriptUrl = url;
    app.transcriptName = originalName;
    return;
  }

  if (key === "bank") {
    app.bankStatementUrl = url;
    app.bankStatementName = originalName;
    return;
  }

  if (key === "photo") {
    app.photoUrl = url;
    app.photoName = originalName;
    return;
  }

  if (key === "familycertificate") {
    app.familyCertificateUrl = url;
    app.familyCertificateName = originalName;
    return;
  }
}


/* ==========================================================
   POST /api/applications/:id/documents
   Student uploads documents (owner only)
========================================================== */
router.post(
  "/:id/documents",
  requireAuth,
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "bank", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "familyCertificate", maxCount: 1 },
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // 🔒 only owner can upload
      if (!req.user || String(application.createdBy) !== String(req.user._id)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const filesMap = req.files as Record<string, Express.Multer.File[]> | undefined;
      if (!filesMap || !Object.keys(filesMap).length) {
        return res.status(400).json({ message: "No files received" });
      }

      for (const field of Object.keys(filesMap)) {
        const file = filesMap[field]?.[0];
        if (!file) continue;
        applyFileToApplication(application as any, field, file);
      }

      await application.save();

      return res.json({
        message: "Documents uploaded successfully",
        application,
      });
    } catch (err: any) {
      console.error("Upload documents error:", err);
      return res.status(500).json({
        message: "Failed to upload documents",
        error: err?.message,
      });
    }
  }
);

export default router;
