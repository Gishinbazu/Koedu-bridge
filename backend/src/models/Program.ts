import { Document, Schema, model, models } from "mongoose";

export interface IProgram extends Document {
  name: string;
  title?: string;
  university: string;
  type: "language" | "bachelor" | "master";
  description?: string;
  duration?: string;
  tuitionFee?: number;
  pdfUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["language", "bachelor", "master"],
      default: "bachelor",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    tuitionFee: {
      type: Number,
      default: 0,
    },
    pdfUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ProgramSchema.pre<IProgram>("validate", function (next) {
  if (!this.name && this.title) {
    this.name = this.title;
  }
  if (!this.title && this.name) {
    this.title = this.name;
  }
  next();
});

export const Program =
  models.Program || model<IProgram>("Program", ProgramSchema, "programs");

export default Program;
