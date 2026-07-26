import { apiFetch } from "./apiClient";

/* =========================================================
   CREATE (Student)
   POST /api/applications
   ========================================================= */
export async function createApplication(payload) {
  return apiFetch("/api/applications", {
    method: "POST",
    body: payload,
  });
}

/* =========================================================
   FETCH MY APPLICATIONS (Student)
   GET /api/applications/my
   ========================================================= */
export async function fetchMyApplications() {
  try {
    const data = await apiFetch("/api/applications/my", { method: "GET" });

    const list =
      (Array.isArray(data) && data) ||
      data?.applications ||
      data?.data?.applications ||
      [];

    return { applications: list };
  } catch (error) {
    console.error("[applicationsApi] Error fetching my applications:", error);
    return { applications: [] };
  }
}

/* =========================================================
   GET APPLICATION BY KOEDU ID
   GET /api/applications/by-koedu/:koeduId
   ========================================================= */
export async function getApplicationByKoeduId(koeduId) {
  if (!koeduId) return null;

  try {
    const data = await apiFetch(`/api/applications/by-koedu/${koeduId}`, {
      method: "GET",
    });

    if (data?.application) return data.application;
    if (data?.data?.application) return data.data.application;
    if (data && !Array.isArray(data)) return data;
    return null;
  } catch (error) {
    console.warn(
      `[applicationsApi] Fetch by koeduId (${koeduId}) failed:`,
      error.message,
    );
    return null;
  }
}

/* =========================================================
   GET BY MONGO _ID OR KOEDU ID (SMART FETCH)
   GET /api/applications/:id
   ========================================================= */
export async function getApplicationByIdOrKoeduId(id) {
  if (!id) return null;

  // 1. Tente la recherche directe via /api/applications/:id
  try {
    const data = await apiFetch(`/api/applications/${id}`, { method: "GET" });
    const app =
      data?.application ||
      data?.data?.application ||
      (data && !Array.isArray(data) ? data : null);

    if (app && (app._id || app.id || app.koeduId)) {
      return app;
    }
  } catch (error) {
    console.log(
      `[applicationsApi] Direct ID fetch failed for ${id}, trying fallback...`,
    );
  }

  // 2. Fallback: Tente la recherche par koeduId
  try {
    return await getApplicationByKoeduId(id);
  } catch (error) {
    console.error(
      "[applicationsApi] Error in getApplicationByIdOrKoeduId:",
      error,
    );
    return null;
  }
}

/* =========================================================
   UPDATE APPLICATION (Smart Update par _id ou koeduId)
   PUT /api/applications/:id
   ========================================================= */
export async function updateApplication(id, payload) {
  if (!id) throw new Error("Application ID is required for update.");

  return apiFetch(`/api/applications/${id}`, {
    method: "PUT",
    body: payload,
  });
}

/* =========================================================
   UPDATE BY KOEDU ID (Legacy Support)
   PUT /api/applications/by-koedu/:koeduId
   ========================================================= */
export async function updateApplicationByKoedu(koeduId, payload) {
  return updateApplication(koeduId, payload);
}

/* =========================================================
   ADMIN: FETCH ALL APPLICATIONS
   GET /api/admin/applications
   ========================================================= */
export async function fetchAllApplicationsAdmin() {
  try {
    const data = await apiFetch("/api/admin/applications", { method: "GET" });

    const list =
      (Array.isArray(data) && data) ||
      data?.applications ||
      data?.data?.applications ||
      [];

    return { applications: list };
  } catch (error) {
    console.error("[applicationsApi] Admin fetch all failed:", error);
    return { applications: [] };
  }
}

/* =========================================================
   ADMIN / USER: FETCH DETAIL BY ID
   GET /api/admin/applications/:id
   ========================================================= */
export async function fetchApplicationById(id) {
  if (!id) return null;

  try {
    const data = await apiFetch(`/api/admin/applications/${id}`, {
      method: "GET",
    });

    return data?.application || data?.data?.application || data || null;
  } catch (error) {
    // Si l'accès admin échoue, tenter la route universelle utilisateur
    return getApplicationByIdOrKoeduId(id);
  }
}

/* =========================================================
   📎 UPLOAD APPLICATION DOCUMENTS
   POST /api/applications/:id/documents
   ========================================================= */
export async function uploadApplicationDocuments(appId, files = {}) {
  const form = new FormData();

  const keyMap = {
    bankStatement: "bank",
    bankStatementFile: "bank",
    bank: "bank",
  };

  Object.entries(files).forEach(([key, file]) => {
    if (!file) return;

    const finalKey = keyMap[key] || key;

    if (file.file && typeof file.file === "object") {
      // Pour environnement Web
      form.append(finalKey, file.file);
    } else if (file.uri) {
      // Pour environnement Mobile (React Native)
      form.append(finalKey, {
        uri: file.uri,
        name: file.name || `${finalKey}.pdf`,
        type: file.type || file.mimeType || "application/pdf",
      });
    }
  });

  return apiFetch(`/api/applications/${appId}/documents`, {
    method: "POST",
    body: form,
  });
}
