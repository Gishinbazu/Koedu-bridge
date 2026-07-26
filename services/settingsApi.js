// app/services/settingsApi.js
import { apiFetch } from "./apiClient";

/** Récupérer les settings de l'utilisateur */
export async function getSettings() {
  return apiFetch("/api/settings/me", { method: "GET" });
}

/** Update settings généraux (compte) */
export async function updateAccountSettings(data) {
  return apiFetch("/api/settings/account", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Notifications */
export async function updateNotificationSettings(data) {
  return apiFetch("/api/settings/notifications", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Langue / région */
export async function updateLanguageSettings(data) {
  return apiFetch("/api/settings/language", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
