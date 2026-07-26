// src/controllers/adminApplicationController.ts
import { Request, Response } from "express";
import { Application } from "../models/Application"; // named export

// Petite util pour échapper correctement les valeurs CSV
function escapeCsv(value: any): string {
  if (value === null || value === undefined) return '""';
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

/**
 * GET /api/admin/applications/export
 * Export CSV des candidatures (avec filtres optionnels).
 */
export async function exportApplicationsCsv(req: Request, res: Response) {
  try {
    const { status, programType, search } = req.query as {
      status?: string;
      programType?: string;
      search?: string;
    };

    const query: any = {};

    if (status && status !== "all") query.status = status;
    if (programType && programType !== "all") query.programType = programType;

    if (search && search.trim()) {
      const regex = new RegExp(String(search).trim(), "i");
      query.$or = [
        { fullName: regex },
        { email: regex },
        { nationality: regex },
        { programName: regex },
        { koeduId: regex },
      ];
    }

    const apps = await Application.find(query).sort({ createdAt: -1 });

    const headers = [
      "koeduId",
      "fullName",
      "nationality",
      "email",
      "phone",
      "programName",
      "programType",
      "status",
      "intake",
      "createdAt",
    ];

    const lines: string[] = [];
    lines.push(headers.join(","));

    for (const app of apps) {
      lines.push(
        [
          escapeCsv(app.koeduId || ""),
          escapeCsv(app.fullName || ""),
          escapeCsv(app.nationality || ""),
          escapeCsv(app.email || ""),
          escapeCsv(app.phone || ""),
          escapeCsv(app.programName || ""),
          escapeCsv(app.programType || ""),
          escapeCsv(app.status || ""),
          escapeCsv(app.intake || ""),
          escapeCsv(app.createdAt ? app.createdAt.toISOString() : ""),
        ].join(",")
      );
    }

    const csv = lines.join("\n");
    const today = new Date().toISOString().slice(0, 10);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="koedu-applications-${today}.csv"`
    );

    return res.send(csv);
  } catch (err) {
    console.error("exportApplicationsCsv error:", err);
    return res.status(500).json({ message: "Failed to export applications" });
  }
}

/**
 * PATCH /api/admin/applications/:id/status
 * Mise à jour du statut d'une candidature.
 */
export async function updateApplicationStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: string };

    const allowed = ["pending", "submitted", "in_review", "accepted", "rejected"];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses: allowed,
      });
    }

    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json({
      message: "Application status updated",
      application: app,
    });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
}
