from apiClient from "./client";
import { apiClient } from "./client";
import { Cliente, CreateCliente, UpdateCliente, Transaccion } from "../types";

export const clientesApi = {
  getAll: async (skip = 0, limit = 50): Promise<Cliente[]> => {
    const res = await apiClient.get<Cliente[]>("/api/v1/clientes", {
      params: { skip, limit },
    });
    return res.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const res = await apiClient.get<Cliente>(`/api/v1/clientes/${id}`);
    return res.data;
  },

  create: async (dto: CreateCliente): Promise<Cliente> => {
    const res = await apiClient.post<Cliente>("/api/v1/clientes", dto);
    return res.data;
  },

  update: async (id: number, dto: UpdateCliente): Promise<Cliente> => {
    const res = await apiClient.put<Cliente>(`/api/v1/clientes/${id}`, dto);
    return res.data;
  },

  delete: async (id: number): Promise<Cliente> => {
    const res = await apiClient.delete<Cliente>(`/api/v1/clientes/${id}`);
    return res.data;
  },

  getTransacciones: async (id: number): Promise<Transaccion[]> => {
    const res = await apiClient.get<Transaccion[]>(`/api/v1/clientes/${id}/transacciones`);
    return res.data;
  },
};
