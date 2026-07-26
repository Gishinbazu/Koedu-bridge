// src/models/User.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "student" | "manager" | "admin" | "superadmin";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // hashed password
  fullName?: string;
  country?: string;
  phone?: string;
  role: UserRole;
  verified: boolean;
  settings?: {
    displayName?: string;
    timezone?: string;
    language?: string;
    region?: string;
    notifications?: {
      emailUpdates?: boolean;
      smsUpdates?: boolean;
      marketing?: boolean;
    };
  };
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    fullName: String,
    country:  String,
    phone:    String,
    role: {
      type: String,
      enum: ["student", "manager", "admin", "superadmin"],
      default: "student",
    },
    verified: { type: Boolean, default: false },

    settings: {
      displayName: String,
      timezone: String,
      language: String,
      region: String,
      notifications: {
        emailUpdates: { type: Boolean, default: true },
        smsUpdates:   { type: Boolean, default: false },
        marketing:    { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
