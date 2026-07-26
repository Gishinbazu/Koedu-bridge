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
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const userId = req.user._id;
    const { track, programName, programTypeLabel, intake, universityName } =
      req.body;

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
      if ((req.body as any)[k] !== undefined)
        safeBody[k] = (req.body as any)[k];
    }

    const app = await Application.create({
      ...safeBody,
      createdBy: userId,
      userId,
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
      success: true,
      message: "Application created successfully",
      application: app,
    });
  } catch (err) {
    console.error("Create application error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET APPLICATION BY ID OR KOEDU ID (Smart Fetch)
   GET /api/applications/:id
   ========================================================= */
export const getApplicationByIdOrKoeduId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { id } = req.params;
    const currentUserIdStr = req.user._id
      ? req.user._id.toString()
      : req.user.id
        ? req.user.id.toString()
        : String(req.user);

    const isAdmin = req.user.role === "admin";

    // Recherche par _id OU koeduId
    const searchCriteria: any[] = [{ koeduId: id }];
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      searchCriteria.push({ _id: id });
    }

    const application = await Application.findOne({ $or: searchCriteria });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Vérification des accès
    const ownerCreatedBy = application.createdBy
      ? application.createdBy.toString()
      : null;
    const ownerUserId = (application as any).userId
      ? (application as any).userId.toString()
      : null;
    const documentHasOwner = Boolean(ownerCreatedBy || ownerUserId);

    if (documentHasOwner && !isAdmin) {
      const isOwner =
        (ownerCreatedBy && ownerCreatedBy === currentUserIdStr) ||
        (ownerUserId && ownerUserId === currentUserIdStr);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to this application",
        });
      }
    }

    return res.json({ success: true, application });
  } catch (error: any) {
    console.error("❌ Error fetching application:", error);
    next(error);
  }
};

/* =========================================================
   UPDATE APPLICATION BY ID OR KOEDU ID (Boosted & Authorized)
   PUT /api/applications/:id
   ========================================================= */
export const updateApplicationByIdOrKoeduId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { id } = req.params;

    // 🔍 Récupération ultra-fiable de l'ID utilisateur
    const currentUserIdStr = req.user._id
      ? req.user._id.toString()
      : req.user.id
        ? req.user.id.toString()
        : String(req.user);

    const isAdmin = req.user.role === "admin";

    // 1. Recherche flexible (par koeduId ou _id MongoDB)
    const searchCriteria: any[] = [{ koeduId: id }];
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      searchCriteria.push({ _id: id });
    }

    const appToUpdate = await Application.findOne({ $or: searchCriteria });

    if (!appToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // 2. Contrôle d'accès sécurisé
    const ownerCreatedBy = appToUpdate.createdBy
      ? appToUpdate.createdBy.toString()
      : null;
    const ownerUserId = (appToUpdate as any).userId
      ? (appToUpdate as any).userId.toString()
      : null;

    const hasOwner = Boolean(ownerCreatedBy || ownerUserId);

    if (hasOwner && !isAdmin) {
      const isOwner =
        (ownerCreatedBy && ownerCreatedBy === currentUserIdStr) ||
        (ownerUserId && ownerUserId === currentUserIdStr);

      if (!isOwner) {
        console.warn(
          `⚠️ Blocked unauthorized update: user ${currentUserIdStr} tried editing app owned by createdBy:${ownerCreatedBy} / userId:${ownerUserId}`,
        );
        return res
          .status(403)
          .json({
            success: false,
            message: "Unauthorized access to this application",
          });
      }
    }

    // 3. Extraction des champs texte du FormData (req.body)
    const updateData: any = {};
    const allowedFields = [
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

    for (const key of allowedFields) {
      if ((req.body as any)[key] !== undefined) {
        updateData[key] = (req.body as any)[key];
      }
    }

    // 4. Traitement des fichiers téléversés via Multer (req.files)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files) {
      if (files["passport"]?.[0]) {
        updateData.passportUrl = `/uploads/${files["passport"][0].filename}`;
        updateData.passportName = files["passport"][0].originalname;
      }
      if (files["transcript"]?.[0]) {
        updateData.transcriptUrl = `/uploads/${files["transcript"][0].filename}`;
        updateData.transcriptName = files["transcript"][0].originalname;
      }
      if (files["bankStatement"]?.[0]) {
        updateData.bankStatementUrl = `/uploads/${files["bankStatement"][0].filename}`;
        updateData.bankStatementName = files["bankStatement"][0].originalname;
      }
      if (files["familyCertificate"]?.[0]) {
        updateData.familyCertificateUrl = `/uploads/${files["familyCertificate"][0].filename}`;
        updateData.familyCertificateName =
          files["familyCertificate"][0].originalname;
      }
      if (files["photo"]?.[0]) {
        updateData.photoUrl = `/uploads/${files["photo"][0].filename}`;
        updateData.photoName = files["photo"][0].originalname;
      }
    }

    // 5. Rattachement automatique de l'utilisateur si la candidature est orpheline
    if (!hasOwner) {
      updateData.createdBy = req.user._id;
      updateData.userId = req.user._id;
    }

    // 6. Mise à jour effective dans MongoDB
    const updatedApplication = await Application.findByIdAndUpdate(
      appToUpdate._id,
      { $set: updateData },
      { new: true, runValidators: false },
    );

    console.log(
      "✅ Application mise à jour dans MongoDB :",
      updatedApplication?._id,
    );

    return res.json({
      success: true,
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("❌ Error updating application:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/* ==========================================================
   UPDATE APPLICATION BY KOEDU ID (Student) - LEGACY SUPPORT
   PUT /api/applications/by-koedu/:koeduId
   ========================================================== */
export const updateApplicationByKoeduForStudent = async (
  req: AuthRequest,
  res: Response,
) => {
  return updateApplicationByIdOrKoeduId(req, res);
};

/* ==========================================================
   GET MY APPLICATIONS (Student)
   GET /api/applications/my
   ========================================================== */
export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const apps = await Application.find({
      $or: [{ createdBy: req.user._id }, { userId: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================
   GET APPLICATION BY KOEDU ID (Student - EDIT MODE LEGACY)
   GET /api/applications/by-koedu/:koeduId
   ========================================================== */
export const getApplicationByKoeduIdForStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  return getApplicationByIdOrKoeduId(req, res, next);
};

/* ==========================================================
   SUBMIT APPLICATION BY KOEDU ID (Student) ✅ FINAL SUBMIT
   PATCH /api/applications/by-koedu/:koeduId/submit
   ========================================================== */
export const submitApplicationByKoeduForStudent = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const { koeduId } = req.params;

    const searchCriteria: any[] = [{ koeduId }];
    if (koeduId.match(/^[0-9a-fA-F]{24}$/)) {
      searchCriteria.push({ _id: koeduId });
    }

    const app = await Application.findOne({ $or: searchCriteria });
    if (!app) return res.status(404).json({ message: "Application not found" });

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
      if ((req.body as any)[k] !== undefined)
        (app as any)[k] = (req.body as any)[k];
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
    return res.json({
      success: true,
      message: "Application submitted",
      application: app,
    });
  } catch (err: any) {
    console.error("submitApplication error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err?.message });
  }
};

/* ==========================================================
   ADMIN: GET ALL APPLICATIONS
   GET /api/admin/applications
   ========================================================== */
export const getAllApplicationsAdmin = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const apps = await Application.find()
      .populate("createdBy", "username email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications: apps });
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
      "username email role",
    );

    if (!app) return res.status(404).json({ message: "Application not found" });

    return res.json({ success: true, application: app });
  } catch (err) {
    console.error("Get application by id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
