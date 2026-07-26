// services/apiClient.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const DEV_PORT = 8000;
const DEV_MACHINE_IP = "192.168.219.109";

const DEFAULT_BASE_URL =
  Platform.OS === "web"
    ? `http://localhost:${DEV_PORT}`
    : `http://${DEV_MACHINE_IP}:${DEV_PORT}`;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

console.log("[apiClient] API_BASE_URL =", API_BASE_URL);

export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const token = await AsyncStorage.getItem("koedu_token");

  const isFormData =
    body && typeof body === "object" && typeof body.append === "function";

  const finalHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // ❗️NE JAMAIS définir Content-Type pour FormData
  if (!isFormData) {
    finalHeaders["Content-Type"] = "application/json";
    finalHeaders.Accept = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw Object.assign(
      new Error(data?.message || data?.error || "Request failed"),
      { status: res.status, data }
    );
  }

  return data;
}
