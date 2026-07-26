// app/services/applicationsApi.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:8000"; // adapte pour device physique

async function authedGet(path) {
  const token = await AsyncStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || "Server error";
    throw new Error(msg);
  }
  return data;
}

export async function getMyApplications() {
  return authedGet("/api/applications/my");
}

export async function getApplicationById(id) {
  return authedGet(`/api/applications/${id}`);
}
