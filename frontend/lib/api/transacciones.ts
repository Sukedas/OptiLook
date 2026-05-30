import { apiClient } from "./client";
import { Transaccion, CreateTransaccion } from "../types";

export interface TransaccionFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  skip?: number;
  limit?: number;
}

export const transaccionesApi = {
  getAll: async (filters: TransaccionFilters = {}): Promise<Transaccion[]> => {
    const res = await apiClient.get<Transaccion[]>("/api/v1/transacciones", {
      params: filters,
    });
    return res.data;
  },

  getById: async (id: number): Promise<Transaccion> => {
    const res = await apiClient.get<Transaccion>(`/api/v1/transacciones/${id}`);
    return res.data;
  },

  create: async (dto: CreateTransaccion): Promise<Transaccion> => {
    const res = await apiClient.post<Transaccion>("/api/v1/transacciones", dto);
    return res.data;
  },

  transitionEstado: async (id: number, estado: string): Promise<Transaccion> => {
    const res = await apiClient.patch<Transaccion>(`/api/v1/transacciones/${id}/estado`, { estado });
    return res.data;
  },
};
