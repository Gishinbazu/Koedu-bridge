// src/server.ts
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import connectDB from "./config/db";
import { ensureUploads } from "./utils/ensureUploads";

// Routes
import authRoutes from "./routes/authRoutes";
import programRoutes from "./routes/program.routes";
import studentRoutes from "./routes/student.routes";
import userRoutes from "./routes/user.routes";

import applicationRoutes from "./routes/application.routes";
import applicationUploadRoutes from "./routes/applicationUpload.routes"; // ✅ Upload des documents

import adminRoutes from "./routes/admin.routes";
import adminAccountRoutes from "./routes/adminAccount.routes";
import adminMetricsRoutes from "./routes/adminMetrics.routes";

// Controllers / Middlewares
import { getMe } from "./controllers/authController";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const PORT = Number(process.env.PORT || 8000);

// ✅ Création des dossiers de base (uploads/applications) avant de lancer les routes
ensureUploads();

/* --------------------------------------------------
   🔧 MIDDLEWARES GLOBAUX
--------------------------------------------------- */
app.use(
  cors({
    origin: true, // Ou ton URL frontend (ex: http://localhost:3000)
    credentials: true,
  })
);

// Configuration Helmet pour autoriser l'affichage des PDF/Images du serveur
app.use(
  helmet({
    crossOriginResourcePolicy: false, 
    contentSecurityPolicy: false, // Utile si tu as des problèmes de chargement de PDF sur certains navigateurs
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------------------------------------------
   ✅ FICHIERS STATIQUES (Accès public aux documents)
   Exemple: http://localhost:8000/uploads/applications/[appId]/passport/xxx.pdf
--------------------------------------------------- */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* --------------------------------------------------
   🩺 TEST DE SANTÉ
--------------------------------------------------- */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "KOEDU Bridge API",
    timestamp: new Date(),
  });
});

/* --------------------------------------------------
   🚀 ROUTES API
--------------------------------------------------- */

// --- AUTHENTIFICATION & USERS ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/api/users/me", requireAuth, getMe);

// --- PROGRAMMES ---
app.use("/api/programs", programRoutes);

// --- APPLICATIONS (GESTION CRUD) ---
app.use("/api/applications", applicationRoutes);

// --- APPLICATIONS (DOCUMENTS / PDF) ---
// Utilise le même préfixe, Express dispatchera vers le POST /:id/documents
app.use("/api/applications", applicationUploadRoutes);

// --- ADMINISTRATION ---
app.use("/api/admin", adminRoutes);
app.use("/api/admin/metrics", adminMetricsRoutes);
app.use("/api/admin/account", adminAccountRoutes);

// --- ESPACE ÉTUDIANT ---
app.use("/api/student", studentRoutes);

/* --------------------------------------------------
   ❌ GESTIONNAIRE D'ERREURS GLOBAL (TOUJOURS EN DERNIER)
--------------------------------------------------- */
app.use(errorHandler);

/* --------------------------------------------------
   ▶️ DÉMARRAGE DU SERVEUR
--------------------------------------------------- */
connectDB()
  .then(() => {
    // 0.0.0.0 permet l'accès depuis d'autres appareils sur le réseau local (ex: test sur mobile)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur démarré sur : http://localhost:${PORT}`);
      console.log(`📂 Dossier uploads : ${path.join(process.cwd(), "uploads")}`);
    });
  })
  .catch((err) => {
    console.error("❌ Échec de la connexion à la base de données :", err);
    process.exit(1);
  });