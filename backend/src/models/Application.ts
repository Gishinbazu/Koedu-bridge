import { Document, Schema, Types, model } from "mongoose";

export interface IApplication extends Document {
  koeduId?: string;
  fullName?: string;
  nationality?: string;
  dob?: string;
  phone?: string;
  email?: string;
  lastSchool?: string;
  major?: string;
  programId?: string;
  programName?: string;
  programType?: "language" | "bachelor" | "master";
  programTypeLabel?: string;
  universityName?: string;

  passportName?: string | null;
  transcriptName?: string | null;
  bankStatementName?: string | null;
  familyCertificateName?: string | null;
  photoName?: string | null;

  passportUrl?: string | null;
  transcriptUrl?: string | null;
  bankStatementUrl?: string | null;
  familyCertificateUrl?: string | null;
  photoUrl?: string | null;

  sponsor?: "self" | "parents";
  intake?: string;
  status?:
    | "draft"
    | "pending"
    | "submitted"
    | "in_review"
    | "accepted"
    | "rejected";
  progress?: number;
  timeline?: {
    submitted?: boolean;
    adminReview?: boolean;
    universityReview?: boolean;
    finalDecision?: boolean;
  };
  createdBy: Types.ObjectId;
  userId?: Types.ObjectId; // ✅ Champ ajouté à l'interface
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    koeduId: { type: String },
    fullName: {
      type: String,
      required: function (this: IApplication) {
        return this.status !== "draft";
      },
    },
    nationality: { type: String },
    dob: { type: String },
    phone: { type: String },
    email: {
      type: String,
      required: function (this: IApplication) {
        return this.status !== "draft";
      },
    },
    lastSchool: { type: String },
    major: { type: String },
    programId: { type: String },
    programName: { type: String },
    programType: { type: String, enum: ["language", "bachelor", "master"] },
    programTypeLabel: { type: String },
    universityName: { type: String },

    passportName: { type: String, default: null },
    transcriptName: { type: String, default: null },
    bankStatementName: { type: String, default: null },
    familyCertificateName: { type: String, default: null },
    photoName: { type: String, default: null },

    passportUrl: { type: String, default: null },
    transcriptUrl: { type: String, default: null },
    bankStatementUrl: { type: String, default: null },
    familyCertificateUrl: { type: String, default: null },
    photoUrl: { type: String, default: null },

    sponsor: { type: String, enum: ["self", "parents"], default: "self" },
    intake: { type: String, default: "Spring 2026" },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "submitted",
        "in_review",
        "accepted",
        "rejected",
      ],
      default: "draft",
    },
    progress: { type: Number, default: 0 },
    timeline: {
      submitted: { type: Boolean, default: false },
      adminReview: { type: Boolean, default: false },
      universityReview: { type: Boolean, default: false },
      finalDecision: { type: Boolean, default: false },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // ✅ Champ ajouté au Schema Mongoose
  },
  { timestamps: true },
);

export const Application = model<IApplication>(
  "Application",
  applicationSchema,
);
