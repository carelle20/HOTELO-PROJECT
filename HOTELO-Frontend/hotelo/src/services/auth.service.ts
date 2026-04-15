import api from "../api/axios";
import type { LoginResponse, RegisterData, User } from "../context/auth.types";

export const authService = {
  login: async (credentials: { email: string; motDePasse: string }): Promise<LoginResponse> => {
    const response = await api.post("/auth/connexion", credentials);
    return response.data;
  },

  register: async (formData: RegisterData): Promise<RegisterData> => {
    const response = await api.post("/auth/inscription", formData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },
};