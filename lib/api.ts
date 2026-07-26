// lib/api.ts
import axios from "axios";

// En dev : ton backend local
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL, // ex: http://localhost:8000
  timeout: 10000,
});
