// src/models/AdminMetrics.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAdminMetrics extends Document {
  totalStudents: number;
  activeApplications: number;
  partnerUniversities: number;
  visaSuccessRate: number; // 0–100 (%)
  createdAt: Date;
  updatedAt: Date;
}

const AdminMetricsSchema = new Schema<IAdminMetrics>(
  {
    totalStudents: {
      type: Number,
      required: true,
      default: 0,
    },
    activeApplications: {
      type: Number,
      required: true,
      default: 0,
    },
    partnerUniversities: {
      type: Number,
      required: true,
      default: 0,
    },
    visaSuccessRate: {
      type: Number,
      required: true,
      default: 0, // percentage
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// Prevent model overwrite error in development (hot reload)
const AdminMetrics =
  mongoose.models.AdminMetrics ||
  mongoose.model<IAdminMetrics>("AdminMetrics", AdminMetricsSchema);

export default AdminMetrics;
