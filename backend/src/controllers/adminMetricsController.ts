// src/controllers/adminMetricsController.ts
import { Request, Response } from "express";
import AdminMetrics from "../models/AdminMetrics";

/**
 * GET /api/admin/metrics
 * → Retourne les métriques admin (KPI) pour KOEDU Bridge.
 *    Ces valeurs sont stockées dans la collection AdminMetrics.
 */
export const getAdminMetrics = async (req: Request, res: Response) => {
  try {
    // On prend le document le plus récent (au cas où il y en ait plusieurs)
    const doc = await AdminMetrics.findOne().sort({ updatedAt: -1 }).lean();

    if (!doc) {
      // Si aucun document n'existe encore, on renvoie des valeurs par défaut
      return res.json({
        metrics: {
          totalStudents: 0,
          activeApplications: 0,
          partnerUniversities: 0,
          visaSuccessRate: 0,
        },
      });
    }

    return res.json({ metrics: doc });
  } catch (err) {
    console.error("[getAdminMetrics] error:", err);
    return res.status(500).json({ message: "Failed to load metrics." });
  }
};

/**
 * PUT /api/admin/metrics
 * → Crée ou met à jour les métriques admin (KPI).
 *    Appelé par la page /admin/edit-stats dans ton app React Native.
 */
export const upsertAdminMetrics = async (req: Request, res: Response) => {
  try {
    const {
      totalStudents,
      activeApplications,
      partnerUniversities,
      visaSuccessRate,
    } = req.body;

    // sécuriser / caster les valeurs
    const payload = {
      totalStudents: Number(totalStudents) || 0,
      activeApplications: Number(activeApplications) || 0,
      partnerUniversities: Number(partnerUniversities) || 0,
      visaSuccessRate: Number(visaSuccessRate) || 0,
    };

    // On utilise un seul document pour toutes les métriques
    let doc = await AdminMetrics.findOne();

    if (!doc) {
      doc = new AdminMetrics(payload);
    } else {
      doc.set(payload);
    }

    await doc.save();

    return res.json({ metrics: doc });
  } catch (err) {
    console.error("[upsertAdminMetrics] error:", err);
    return res.status(500).json({ message: "Failed to save metrics." });
  }
};
