import dotenv from "dotenv";

dotenv.config();

console.log("👉 MONGODB_URI from env:", process.env.MONGODB_URI);

export const PORT = process.env.PORT || "8000";
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
export const EMAIL_USER = process.env.EMAIL_USER || "";
export const EMAIL_PASS = process.env.EMAIL_PASS || "";

export const config = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASS
};
