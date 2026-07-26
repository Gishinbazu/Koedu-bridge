// services/applicationsApi.js
import { apiFetch } from "./apiClient";

/* =========================================================
   CREATE (Student)
   ========================================================= */
export async function createApplication(payload) {
  return apiFetch("/api/applications", {
    method: "POST",
    body: payload,
  });
}

/* =========================================================
   MY APPLICATIONS (Student)
   Backend may return:
   - { applications: [...] }
   - [...]
   - { data: { applications: [...] } }
   ========================================================= */
export async function fetchMyApplications() {
  const data = await apiFetch("/api/applications/my", { method: "GET" });

  const list =
    (Array.isArray(data) && data) ||
    data?.applications ||
    data?.data?.applications ||
    [];

  return { applications: list };
}

/* =========================================================
   GET BY KOEDU ID
   Backend may return:
   - { application: {...} }
   - {...}
   - { data: { application: {...} } }
   ========================================================= */
export async function getApplicationByKoeduId(koeduId) {
  const data = await apiFetch(`/api/applications/by-koedu/${koeduId}`, {
    method: "GET",
  });

  if (data?.application) return data.application;
  if (data?.data?.application) return data.data.application;
  if (data && !Array.isArray(data)) return data;
  return null;
}

/* =========================================================
   UPDATE BY KOEDU ID
   ========================================================= */
export async function updateApplicationByKoedu(koeduId, payload) {
  return apiFetch(`/api/applications/by-koedu/${koeduId}`, {
    method: "PUT",
    body: payload,
  });
}

/* =========================================================
   ADMIN: FETCH ALL
   Backend may return:
   - { applications: [...] }
   - [...]
   - { data: { applications: [...] } }
   ========================================================= */
export async function fetchAllApplicationsAdmin() {
  const data = await apiFetch("/api/admin/applications", { method: "GET" });

  const list =
    (Array.isArray(data) && data) ||
    data?.applications ||
    data?.data?.applications ||
    [];

  return { applications: list };
}

/* =========================================================
   ADMIN: FETCH ONE (DETAIL) BY ID
   GET /api/admin/applications/:id
   Backend may return:
   - { application: {...} }
   - {...}
   - { data: { application: {...} } }
   ========================================================= */
export async function fetchApplicationById(id) {
  return apiFetch(`/api/admin/applications/${id}`, {
    method: "GET",
  });
}

/* =========================================================
   📎 UPLOAD APPLICATION DOCUMENTS
   POST /api/applications/:id/documents
   IMPORTANT: :id = Mongo _id (appId), NOT koeduId
   ========================================================= */
export async function uploadApplicationDocuments(appId, files = {}) {
  const form = new FormData();

  // ✅ mapping si ton backend attend "bank" mais ton front utilise "bankStatement"
  // Tu peux ajouter d'autres mappings ici si besoin.
  const keyMap = {
    bankStatement: "bank",
    bankStatementFile: "bank",
    bank: "bank",
  };

  Object.entries(files).forEach(([key, file]) => {
    if (!file?.uri) return;

    const finalKey = keyMap[key] || key;

    form.append(finalKey, {
      uri: file.uri,
      name: file.name || `${finalKey}.jpg`,
      type: file.type || "application/octet-stream",
    });
  });

  return apiFetch(`/api/applications/${appId}/documents`, {
    method: "POST",
    body: form, // ✅ FormData (apiFetch doit éviter JSON + Content-Type)
  });
}
