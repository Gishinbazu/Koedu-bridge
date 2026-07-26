// services/authApi.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./apiClient";

if (!API_BASE_URL) {
  console.warn("[authApi] API_BASE_URL is undefined. Check services/apiClient.js");
}

// -----------------------------
// Internal helper
// -----------------------------
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function rawAuthFetch(path, method = "POST", payload) {
  const url = `${API_BASE_URL}${path}`;
  console.log("[authApi] →", method, url);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await safeJson(res);

  console.log("[authApi] status:", res.status);
  if (data) console.log("[authApi] data:", data);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data ?? {};
}

// -----------------------------
// LOGIN
// -----------------------------
export async function loginUser({ email, password }) {
  const data = await rawAuthFetch("/api/auth/login", "POST", { email, password });

  const token = data?.token || data?.accessToken || data?.jwt || null;
  if (token) {
    await AsyncStorage.setItem("koedu_token", token);
  }

  if (data?.user) {
    await AsyncStorage.setItem("koedu_user", JSON.stringify(data.user));
  }

  return data;
}

// -----------------------------
// REGISTER
// -----------------------------
export async function registerUser({ username, email, password }) {
  return rawAuthFetch("/api/auth/register", "POST", { username, email, password });
}

// -----------------------------
// GET CURRENT USER
// -----------------------------
export async function getCurrentUser() {
  try {
    const token = await AsyncStorage.getItem("koedu_token");
    if (!token) return null;

    const url = `${API_BASE_URL}/api/users/me`;
    console.log("[authApi] → GET", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await safeJson(res);

    if (!res.ok) {
      console.log("[authApi] getCurrentUser failed:", res.status, data);
      return null;
    }

    // backend peut renvoyer { user: {...} } ou directement {...}
    return data?.user || data || null;
  } catch (e) {
    console.log("[authApi] getCurrentUser error:", e?.message || e);
    return null;
  }
}

// -----------------------------
// LOGOUT
// -----------------------------
export async function logoutUser() {
  await AsyncStorage.multiRemove(["koedu_token", "koedu_user"]);
}
