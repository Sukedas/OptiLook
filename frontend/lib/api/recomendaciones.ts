import { apiClient } from "./client";
import { Recomendacion } from "../types";

export interface GenerarRecomendacionPayload {
  idUsuario: number;
  idTipo: number;
}

export const recomendacionesApi = {
  generar: async (payload: GenerarRecomendacionPayload): Promise<Recomendacion[]> => {
    const res = await apiClient.post<Recomendacion[]>("/api/v1/recomendaciones", payload);
    return res.data;
  },

  getHistory: async (clienteId: number): Promise<Recomendacion[]> => {
    const res = await apiClient.get<Recomendacion[]>(`/api/v1/recomendaciones/${clienteId}`);
    return res.data;
  },
};
