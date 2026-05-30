"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, LoginCredentials } from "../lib/api/auth";
import { Cliente, CreateCliente } from "../lib/types";

interface AuthContextType {
  user: Cliente | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (dto: CreateCliente) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Cliente | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem("optilook_token");
    const savedUser = localStorage.getItem("optilook_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user session:", e);
        localStorage.removeItem("optilook_token");
        localStorage.removeItem("optilook_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("optilook_token", data.token);
      localStorage.setItem("optilook_user", JSON.stringify(data.user));
      router.push("/clientes"); // Redirect to clientes dashboard after login
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dto: CreateCliente) => {
    setIsLoading(true);
    try {
      // Register
      const createdUser = await authApi.register(dto);
      // Auto login
      await login({
        correoUsuario: createdUser.correoUsuario,
        contrasena: dto.contrasena,
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("optilook_token");
    localStorage.removeItem("optilook_user");
    router.push("/login");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
