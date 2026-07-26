import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { Application } from "../models/Application";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

function findNewestFileIn(dir: string) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  if (!files.length) return null;

  // prend le fichier le plus récent (mtime)
  const newest = files
    .map((name) => {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      return { name, full, mtime: stat.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime)[0];

  return newest?.name || null;
}

function toPublicUrl(subfolder: string, filename: string) {
  return `/uploads/${subfolder}/${filename}`.replace(/\\/g, "/");
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env");

  await mongoose.connect(uri);
  console.log("✅ Connected");

  const apps = await Application.find({});
  console.log("Found apps:", apps.length);

  let updated = 0;

  for (const app of apps) {
    let changed = false;

    // Passport
    if (app.passportName && !app.passportUrl) {
      const f = findNewestFileIn(path.join(UPLOADS_DIR, "passport"));
      if (f) {
        app.passportUrl = toPublicUrl("passport", f);
        changed = true;
      }
    }

    // Transcript
    if (app.transcriptName && !app.transcriptUrl) {
      const f = findNewestFileIn(path.join(UPLOADS_DIR, "transcript"));
      if (f) {
        app.transcriptUrl = toPublicUrl("transcript", f);
        changed = true;
      }
    }

    // Bank
    if (app.bankStatementName && !app.bankStatementUrl) {
      const f = findNewestFileIn(path.join(UPLOADS_DIR, "bank"));
      if (f) {
        app.bankStatementUrl = toPublicUrl("bank", f);
        changed = true;
      }
    }

    // Photo
    if (app.photoName && !app.photoUrl) {
      const f = findNewestFileIn(path.join(UPLOADS_DIR, "photo"));
      if (f) {
        app.photoUrl = toPublicUrl("photo", f);
        changed = true;
      }
    }

    // Family certificate
    if (app.familyCertificateName && !app.familyCertificateUrl) {
      const f = findNewestFileIn(path.join(UPLOADS_DIR, "familyCertificate"));
      if (f) {
        app.familyCertificateUrl = toPublicUrl("familyCertificate", f);
        changed = true;
      }
    }

    if (changed) {
      await app.save();
      updated++;
      console.log("✅ fixed:", app._id.toString());
    }
  }

  console.log(`Done. Updated ${updated} apps.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
