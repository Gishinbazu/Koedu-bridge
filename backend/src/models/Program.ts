// src/models/Program.ts
import { Document, Schema, Types, model } from "mongoose";

export type ProgramLevel = "Bachelor" | "Master" | "Language" | "Other";

export interface IProgram extends Document {
  name: string;
  level: ProgramLevel;
  university: Types.ObjectId;
  faculty?: string;
  city?: string;
  language?: string;
  tuitionPerSemester?: number;
  applicationFee?: number;
  description?: string;
  tags?: string[];
  isActive: boolean;
}

const programSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["Bachelor", "Master", "Language", "Other"],
      default: "Other"
    },
    university: { type: Schema.Types.ObjectId, ref: "University", required: true },
    faculty: String,
    city: String,
    language: String,
    tuitionPerSemester: Number,
    applicationFee: Number,
    description: String,
    tags: [String],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Program = model<IProgram>("Program", programSchema);
