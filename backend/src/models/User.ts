// src/models/User.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "student" | "admin" | "superadmin";

  // Optional profile info
  phone?: string;
  organization?: string;

  // Notifications preferences
  emailNewApp?: boolean;
  emailStatusChange?: boolean;
  emailWeeklySummary?: boolean;
  inAppAlerts?: boolean;

  // Localization preferences
  country?: string;   // ex: "KR"
  language?: string;  // ex: "en", "ko"
  timezone?: string;  // ex: "Asia/Seoul"

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "admin", "superadmin"],
      default: "student",
    },

    // Optional profile info
    phone: { type: String },
    organization: { type: String },

    // Notification preferences
    emailNewApp:       { type: Boolean, default: true },
    emailStatusChange: { type: Boolean, default: true },
    emailWeeklySummary:{ type: Boolean, default: false },
    inAppAlerts:       { type: Boolean, default: true },

    // Localization preferences
    country:  { type: String, default: "KR" },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "Asia/Seoul" },
  },
  {
    timestamps: true,
  }
);

// ✅ Fix OverwriteModelError avec ts-node-dev / hot reload
export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
