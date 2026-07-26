// src/controllers/application.controller.ts
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Application } from "../models/Application";

/* ==========================================================
   CREATE APPLICATION (Student) ✅ DRAFT FIRST
   POST /api/applications
   ========================================================== */
export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const userId = req.user._id;

    const { track, programName, programTypeLabel, intake, universityName } = req.body;

    if (!programName || !programTypeLabel) {
      return res.status(400).json({
        message: "programName and programTypeLabel are required",
      });
    }

    const uniSlug = (universityName || "sunmoon-university")
      .toLowerCase()
      .replace(/\s+/g, "-");
    const intakeSlug = (intake || "2026").toLowerCase().replace(/\s+/g, "-");
    const trackSlug = (track || "lang").toLowerCase();

    const koeduId = req.body.koeduId || `${uniSlug}-${intakeSlug}-${trackSlug}`;

    // ✅ SECURITY: whitelist only fields that student is allowed to set at creation
    const allowedCreateFields = [
      "fullName",
      "nationality",
      "dob",
      "phone",
      "email",
      "lastSchool",
      "major",
      "sponsor",
      "programId",
      "programName",
      "programType",
      "programTypeLabel",
      "universityName",
      "intake",
      "motivation",
      "notes",
      "comments",
      "track",
    ];

    const safeBody: any = {};
    for (const k of allowedCreateFields) {
      if ((req.body as any)[k] !== undefined) safeBody[k] = (req.body as any)[k];
    }

    const app = await Application.create({
      ...safeBody,
      createdBy: userId,
      koeduId,
      track,
      programName,
      programTypeLabel,
      intake,
      universityName,

      status: "draft",
      progress: 0,
      timeline: {
        submitted: false,
        adminReview: false,
        universityReview: false,
        finalDecision: false,
      },
    });

    return res.status(201).json({
      message: "Application created successfully",
      application: app,
    });
  } catch (err) {
    console.error("Create application error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================
   UPDATE APPLICATION BY KOEDU ID (Student) ✅ DRAFT SAVE
   PUT /api/applications/by-koedu/:koeduId
   ========================================================== */
export const updateApplicationByKoeduForStudent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { koeduId } = req.params;

    const app = await Application.findOne({ koeduId, createdBy: req.user._id });
    if (!app) return res.status(404).json({ message: "Application not found" });

    // ✅ champs autorisés en draft (student) — (campus removed unless it exists in schema)
    const allowed = [
      "fullName",
      "nationality",
      "dob",
      "phone",
      "email",
      "lastSchool",
      "major",
      "sponsor",
      "programId",
      "programName",
      "programType",
      "programTypeLabel",
      "universityName",
      "intake",
      "motivation",
      "notes",
      "comments",
    ];

    for (const k of allowed) {
      if ((req.body as any)[k] !== undefined) (app as any)[k] = (req.body as any)[k];
    }

    // ✅ recalcul progress while draft (optional)
    if (app.status === "draft") {
      const filled = [
        app.fullName,
        app.nationality,
        app.dob,
        app.phone,
        app.email,
        app.lastSchool,
        app.major,
        app.programName,
        app.universityName,
        app.intake,
      ].filter(Boolean).length;

      const total = 10;
      app.progress = Math.min(20, Math.round((filled / total) * 20)); // 0..20 in draft
    }

    await app.save();
    return res.json({ message: "Application updated", application: app });
  } catch (err: any) {
    console.error("updateApplicationByKoeduForStudent error:", err);
    return res.status(500).json({ message: "Server error", error: err?.message });
  }
};

/* ==========================================================
   GET MY APPLICATIONS (Student)
   GET /api/applications
   ========================================================== */
export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const apps = await Application.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ applications: apps });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================
   GET APPLICATION BY KOEDU ID (Student - EDIT MODE)
   GET /api/applications/by-koedu/:koeduId
   ========================================================== */
export const getApplicationByKoeduIdForStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { koeduId } = req.params;

    const app = await Application.findOne({ koeduId, createdBy: req.user._id });
    if (!app) return res.status(404).json({ message: "Application not found" });

    return res.json({ application: app });
  } catch (err) {
    next(err);
  }
};

/* ==========================================================
   SUBMIT APPLICATION BY KOEDU ID (Student) ✅ FINAL SUBMIT
   PATCH /api/applications/by-koedu/:koeduId/submit
   ========================================================== */
export const submitApplicationByKoeduForStudent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { koeduId } = req.params;

    const app = await Application.findOne({ koeduId, createdBy: req.user._id });
    if (!app) return res.status(404).json({ message: "Application not found" });

    // ✅ only allow safe fields right before submit
    const allowed = [
      "fullName",
      "nationality",
      "dob",
      "phone",
      "email",
      "lastSchool",
      "major",
      "sponsor",
      "programId",
      "programName",
      "programType",
      "programTypeLabel",
      "universityName",
      "intake",
    ];

    for (const k of allowed) {
      if ((req.body as any)[k] !== undefined) (app as any)[k] = (req.body as any)[k];
    }

    app.status = "pending";
    app.progress = 25;
    app.timeline = {
      ...(app.timeline || {}),
      submitted: true,
      adminReview: false,
      universityReview: false,
      finalDecision: false,
    };

    await app.save();
    return res.json({ message: "Application submitted", application: app });
  } catch (err: any) {
    console.error("submitApplication error:", err);
    return res.status(500).json({ message: "Server error", error: err?.message });
  }
};

/* ==========================================================
   ADMIN: GET ALL APPLICATIONS
   GET /api/admin/applications
   ========================================================== */
export const getAllApplicationsAdmin = async (_req: AuthRequest, res: Response) => {
  try {
    const apps = await Application.find()
      .populate("createdBy", "username email role")
      .sort({ createdAt: -1 });

    res.json({ applications: apps });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================
   ADMIN: GET APPLICATION BY ID (DETAIL)
   GET /api/admin/applications/:id
   ========================================================== */
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const app = await Application.findById(req.params.id).populate(
      "createdBy",
      "username email role"
    );

    if (!app) return res.status(404).json({ message: "Application not found" });

    // ✅ includes docs urls by default (no select)
    return res.json({ application: app });
  } catch (err) {
    console.error("Get application by id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
