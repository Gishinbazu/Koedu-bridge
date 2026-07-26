import { NextFunction, Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { AuthRequest, requireAuth } from "../middleware/auth";
import { Application } from "../models/Application";

const router = Router();
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const APPS_ROOT = path.join(UPLOAD_ROOT, "applications");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeField(fieldname: string) {
  return String(fieldname || "").toLowerCase().replace(/_/g, "");
}

function safeDocType(fieldname: string) {
  const key = normalizeField(fieldname);
  if (key === "passport") return "passport";
  if (key === "transcript") return "transcript";
  if (key === "bank" || key === "bankstatement") return "bank";
  if (key === "photo") return "photo";
  if (key === "familycertificate") return "familyCertificate";
  return "misc";
}

function publicUrl(appId: string, docType: string, filename: string) {
  return `/uploads/applications/${appId}/${docType}/${filename}`.replace(/\\/g, "/");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const appId = String((req as any).params?.id || "");
      const docType = safeDocType(file.fieldname);
      const dir = path.join(APPS_ROOT, appId, docType);
      ensureDir(dir);
      cb(null, dir);
    } catch (e: any) {
      cb(e, "");
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname || "");
    if (!isPdf) return cb(new Error("Only PDF files are allowed."));
    cb(null, true);
  },
});

function applyFileToApplication(app: any, field: string, file: Express.Multer.File, appId: string) {
  const docType = safeDocType(field);
  const url = publicUrl(appId, docType, file.filename);
  const originalName = file.originalname;
  const key = normalizeField(field);

  if (key === "passport") { app.passportUrl = url; app.passportName = originalName; return; }
  if (key === "transcript") { app.transcriptUrl = url; app.transcriptName = originalName; return; }
  if (key === "bank" || key === "bankstatement") { app.bankStatementUrl = url; app.bankStatementName = originalName; return; }
  if (key === "photo") { app.photoUrl = url; app.photoName = originalName; return; }
  if (key === "familycertificate") { app.familyCertificateUrl = url; app.familyCertificateName = originalName; return; }
}

router.post(
  "/:id/documents",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return res.status(400).json({ message: "Missing application id" });
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    upload.fields([
      { name: "passport", maxCount: 1 },
      { name: "transcript", maxCount: 1 },
      { name: "bank", maxCount: 1 },
      { name: "bankStatement", maxCount: 1 },
      { name: "photo", maxCount: 1 },
      { name: "familyCertificate", maxCount: 1 },
    ])(req, res, (err: any) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res: Response) => {
    const authReq = req as AuthRequest & { files?: Record<string, Express.Multer.File[]> };
    try {
      const app = await Application.findById(authReq.params.id);
      if (!app) return res.status(404).json({ message: "Application not found" });
      if (String(app.createdBy) !== String(authReq.user?._id)) return res.status(403).json({ message: "Forbidden" });

      const filesMap = authReq.files || {};
      Object.keys(filesMap).forEach(field => {
        const file = filesMap[field]?.[0];
        if (file) applyFileToApplication(app, field, file, authReq.params.id);
      });

      await app.save();
      return res.json({ message: "Documents uploaded successfully", application: app });
    } catch (err: any) {
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;