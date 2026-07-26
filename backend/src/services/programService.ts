import axios from "axios";
import { getToken } from "../authStorage";

const API_URL = "http://localhost:8000"; 

export const fetchPrograms = async (params?: {
  q?: string;
  level?: string;
  city?: string;
}) => {
  const token = await getToken();

  const res = await axios.get("http://localhost:8000/api/programs", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return res.data;
};
