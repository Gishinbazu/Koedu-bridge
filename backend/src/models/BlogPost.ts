import { Document, Schema, model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  category?: string;
  published: boolean;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: String,
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);
