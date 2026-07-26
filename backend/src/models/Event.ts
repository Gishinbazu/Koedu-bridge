import { Document, Schema, model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    location: String
  },
  { timestamps: true }
);

export const Event = model<IEvent>("Event", eventSchema);
