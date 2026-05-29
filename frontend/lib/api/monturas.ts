import { apiClient } from "./client";
import { Montura } from "../types";

export interface MonturaFilters {
  gender?: string;
  color?: string;
  min_price?: number;
  max_price?: number;
  has_stock?: boolean;
  skip?: number;
  limit?: number;
}

export const monturasApi = {
  getAll: async (filters: MonturaFilters = {}): Promise<Montura[]> => {
    const res = await apiClient.get<Montura[]>("/api/v1/monturas", {
      params: filters,
    });
    return res.data;
  },

  getById: async (id: number): Promise<Montura> => {
    const res = await apiClient.get<Montura>(`/api/v1/monturas/${id}`);
    return res.data;
  },

  create: async (dto: Partial<Montura>): Promise<Montura> => {
    const res = await apiClient.post<Montura>("/api/v1/monturas", dto);
    return res.data;
  },

  update: async (id: number, dto: Partial<Montura>): Promise<Montura> => {
    const res = await apiClient.put<Montura>(`/api/v1/monturas/${id}`, dto);
    return res.data;
  },

  adjustStock: async (id: number, stock: number): Promise<Montura> => {
    const res = await apiClient.patch<Montura>(`/api/v1/monturas/${id}/stock`, { stock });
    return res.data;
  },
};
