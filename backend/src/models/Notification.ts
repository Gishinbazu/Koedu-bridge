import { Document, Schema, Types, model } from "mongoose";

export interface INotification extends Document {
  user: Types.ObjectId;
  title: string;
  body: string;
  read: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
