import { apiClient } from "./client";
import { Cliente, CreateCliente } from "../types";

export interface LoginCredentials {
  correoUsuario: string;
  contrasena: string;
}

export interface LoginResponse {
  user: Cliente;
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/api/v1/auth/login", credentials);
    return res.data;
  },

  register: async (dto: CreateCliente): Promise<Cliente> => {
    const res = await apiClient.post<Cliente>("/api/v1/auth/register", dto);
    return res.data;
  },
};
