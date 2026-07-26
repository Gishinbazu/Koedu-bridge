// app/services/userApi.js
import { apiFetch } from "./apiClient";

/* ============================================================
   🔵 USER (commun à admin + student)
   ============================================================ */

/** Récupérer le profil user connecté */
export async function getProfile() {
  return apiFetch("/api/users/me", { method: "GET" });
}

/** Mise à jour du profil user */
export async function updateProfile(data) {
  // ✅ on envoie un objet, apiFetch stringify (si bien fait)
  return apiFetch("/api/users/me", {
    method: "PUT",
    body: data,
  });
}

/** Modification du mot de passe */
export async function changePassword({ currentPassword, newPassword }) {
  return apiFetch("/api/users/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}

/* ============================================================
   🟢 STUDENT SIDE HELPERS
   ============================================================ */

/**
 * Récupérer la dernière application du student connecté
 * ↳ backend : GET /api/applications/my
 */
export async function getStudentApplication() {
  const res = await apiFetch("/api/applications/my", { method: "GET" });

  const apps = res?.applications || [];
  if (!apps.length) return null;

  // backend trié desc -> plus récente = 0
  return apps[0];
}

/** Récupérer liste des documents */
export async function getStudentDocuments() {
  return apiFetch("/api/student/documents", { method: "GET" });
}

/** Mettre à jour 1 document */
export async function updateStudentDocument(docKey, payload) {
  return apiFetch(`/api/student/documents/${docKey}`, {
    method: "PATCH",
    body: payload,
  });
}

/** Profil student — lire */
export async function getStudentProfile() {
  return apiFetch("/api/student/profile", { method: "GET" });
}

/** Profil student — mettre à jour */
export async function updateStudentProfile(payload) {
  return apiFetch("/api/student/profile", {
    method: "PATCH",
    body: payload,
  });
}
