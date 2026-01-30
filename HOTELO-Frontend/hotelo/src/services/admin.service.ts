// src/services/admin.service.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin"; // À adapter à ton URL

export interface AdminStats {
  hotelsCount: number;
  managersCount: number;
  pendingValidationCount: number;
  totalBookings: number;
}

export const adminService = {
  /**
   * Récupère les chiffres clés pour le dashboard
   */
  getStats: async (): Promise<AdminStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  /**
   * Récupère tous les responsables d'hôtels (pour ta page Responsables)
   */
  getAllManagers: async () => {
    const response = await axios.get(`${API_URL}/hotel-managers`);
    return response.data;
  },

  /**
   * Approuve un chef d'hôtel pour qu'il puisse publier
   */
  validateManager: async (idUtilisateur: number) => {
    const response = await axios.patch(`${API_URL}/valider-hotelier/${idUtilisateur}`, {
      estApprouve: true
    });
    return response.data;
  }
};