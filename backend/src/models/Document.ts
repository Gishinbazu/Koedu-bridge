// src/models/Document.ts
import { Document as MongooseDocument, Schema, Types, model } from "mongoose";

export type DocType =
  | "passport"
  | "transcript"
  | "bank"
  | "photo"
  | "familyCertificate"
  | "misc";

export interface IDocument extends MongooseDocument {
  applicationId: Types.ObjectId;      // lien vers Application
  uploadedBy: Types.ObjectId;         // lien vers User (étudiant)
  type: DocType;                      // passport / transcript / bank / ...
  originalName: string;               // nom du fichier original
  filename: string;                   // nom stocké sur disque (multer)
  mimeType?: string;                  // image/png, application/pdf, ...
  size?: number;                      // taille en bytes
  path: string;                       // chemin relatif DB: "/uploads/passport/xxx.png"
  url: string;                        // url publique (souvent identique à path)
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["passport", "transcript", "bank", "photo", "familyCertificate", "misc"],
      required: true,
      index: true,
    },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, default: null },
    size: { type: Number, default: null },

    // Exemple: "/uploads/passport/1734-xxxx.png"
    path: { type: String, required: true },

    // Exemple: "/uploads/passport/1734-xxxx.png"
    // (si tu veux plus tard mettre un CDN, tu peux changer ici)
    url: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ évite les doublons du même type sur la même application (optionnel)
// si tu veux autoriser plusieurs fichiers par type, supprime cet index.
documentSchema.index({ applicationId: 1, type: 1 }, { unique: true });

export const DocumentModel = model<IDocument>("Document", documentSchema);
