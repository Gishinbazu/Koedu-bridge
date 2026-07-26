// src/models/Program.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type ProgramLevel = "bachelor" | "master" | "language" | "phd" | "certificate";
export type TeachingLanguage = "korean" | "english" | "mixed";

export interface IProgram extends Document {
  title: string;                 // e.g. "Global Management"
  university: string;            // e.g. "Sunmoon University"
  campus?: string;               // e.g. "Asan campus"
  level: ProgramLevel;           // bachelor / master / language ...
  track?: string;                // e.g. "Business / Management"
  code?: string;                 // optional internal code

  durationSemesters?: number;    // e.g. 8 for bachelor
  tuitionPerSemester?: number;   // en KRW
  currency?: string;             // "KRW", "USD"...

  teachingLanguage: TeachingLanguage; // korean / english / mixed

  summary?: string;              // short description (card)
  description?: string;          // long description (detail page)
  highlights?: string[];         // bullet points

  applicationOpen?: Date;
  applicationClose?: Date;
  intake?: string;               // e.g. "Spring 2026"

  tags?: string[];               // ["Business", "Scholarship available", ...]
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true },
    university: { type: String, required: true },
    campus: String,
    level: {
      type: String,
      enum: ["bachelor", "master", "language", "phd", "certificate"],
      required: true,
    },
    track: String,
    code: String,

    durationSemesters: Number,
    tuitionPerSemester: Number,
    currency: { type: String, default: "KRW" },

    teachingLanguage: {
      type: String,
      enum: ["korean", "english", "mixed"],
      default: "korean",
    },

    summary: String,
    description: String,
    highlights: [String],

    applicationOpen: Date,
    applicationClose: Date,
    intake: String,

    tags: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Important : réutiliser le model s'il existe déjà (hot reload)
const Program: Model<IProgram> =
  (mongoose.models.Program as Model<IProgram>) ||
  mongoose.model<IProgram>("Program", programSchema);

export default Program;
