// src/services/email.service.ts
import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config/env";

// --- Create reusable transporter ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// --- Send email function ---
export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("⚠️ Email service not configured (EMAIL_USER or EMAIL_PASS missing)");
    return;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};
