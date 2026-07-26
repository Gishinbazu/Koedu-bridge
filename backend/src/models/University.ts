import { Document, Schema, model } from "mongoose";

export interface IUniversity extends Document {
  name: string;
  city?: string;
  country?: string;
  website?: string;
}

const universitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true },
    city: String,
    country: { type: String, default: "South Korea" },
    website: String
  },
  { timestamps: true }
);

export const University = model<IUniversity>("University", universitySchema);
