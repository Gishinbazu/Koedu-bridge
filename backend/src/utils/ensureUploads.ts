import fs from "fs";
import path from "path";

/**
 * Ensure base upload folders exist
 * Structure:
 * uploads/
 * └─ applications/
 *    └─ <applicationId>/
 *       ├─ passport/
 *       ├─ transcript/
 *       ├─ bank/
 *       ├─ photo/
 *       └─ familyCertificate/
 */
export function ensureUploads() {
  const uploadRoot = path.join(process.cwd(), "uploads");
  const applicationsRoot = path.join(uploadRoot, "applications");

  if (!fs.existsSync(uploadRoot)) {
    fs.mkdirSync(uploadRoot, { recursive: true });
  }

  if (!fs.existsSync(applicationsRoot)) {
    fs.mkdirSync(applicationsRoot, { recursive: true });
  }

  console.log("✅ Upload folders ready (applications-based)");
}
