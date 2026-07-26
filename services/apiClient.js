import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const DEV_PORT = 8000;
const DEV_MACHINE_IP = "192.168.219.109";

const DEFAULT_BASE_URL =
  Platform.OS === "web"
    ? `http://localhost:${DEV_PORT}`
    : `http://${DEV_MACHINE_IP}:${DEV_PORT}`;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

console.log("[apiClient] API_BASE_URL =", API_BASE_URL);

/**
 * Helper to retrieve stored auth token across platforms and fallback keys
 */
async function getAuthToken() {
  let token = null;

  try {
    if (Platform.OS === "web") {
      token =
        localStorage.getItem("koedu_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("userToken") ||
        localStorage.getItem("auth_token");
    }

    // Fallback to AsyncStorage (for React Native mobile or web sync)
    if (!token) {
      token =
        (await AsyncStorage.getItem("koedu_token")) ||
        (await AsyncStorage.getItem("token")) ||
        (await AsyncStorage.getItem("userToken"));
    }
  } catch (e) {
    console.log("[apiClient] Error reading token from storage:", e);
  }

  return token;
}

export async function apiFetch(
  path,
  { method = "GET", body, headers = {} } = {},
) {
  // 1. Get Auth Token
  const token = await getAuthToken();

  // 2. Check if body is FormData
  const isFormData =
    body && typeof body === "object" && typeof body.append === "function";

  // 3. Build headers
  const finalHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // ❗️NE JAMAIS définir Content-Type pour FormData (browser/RN set boundings automatiques)
  if (!isFormData) {
    finalHeaders["Content-Type"] = "application/json";
    finalHeaders.Accept = "application/json";
  }

  // 4. Send request
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw Object.assign(
      new Error(
        data?.message || data?.error || `Request failed (${res.status})`,
      ),
      { status: res.status, data },
    );
  }

  return data;
}

export default apiFetch;
