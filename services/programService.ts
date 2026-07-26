// services/programService.ts
import { getToken } from "../hooks/authStorage";
import { api } from "../lib/api";

export type ProgramQuery = {
  q?: string;
  level?: string;
  city?: string;
};

export type Program = {
  _id: string;
  name: string;
  university: string;
  city: string;
  level: string;
  // ajoute d'autres champs si tu en as (tuition, language, etc.)
};

export const fetchPrograms = async (params?: ProgramQuery): Promise<Program[]> => {
  const token = await getToken(); // si tu n'as pas encore d'auth, tu peux enlever cette ligne

  const res = await api.get<Program[]>("/programs", {
    // si ton backend est sur /api/programs, mets "/api/programs"
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params,
  });

  return res.data;
};
