// src/services/admin.service.ts
import api from "../api/axios";

const API_URL = "http://localhost:5000/api/admin";

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
    const response = await api.get(`${API_URL}/dashboard`);
    return response.data;
  },

  /**
   * Récupère tous les responsables d'hôtels (pour ta page Responsables)
   */
  getAllManagers: async () => {
    const response = await api.get(`${API_URL}/hotel-managers`);
    return response.data;
  },

  /**
   * Approuve un chef d'hôtel pour qu'il puisse publier
   */
  validateManager: async (idUtilisateur: number) => {
    const response = await api.patch(`${API_URL}/valider-hotelier/${idUtilisateur}`, {
      estApprouve: true
    });
    return response.data;
  },

  // Creation equipement
  createEquipement: async (nom: string, icone?: string) => {
    const response = await api.post(`${API_URL}/catalog/equipements`, { nom, icone });
    return response.data;
  },

  // Récupérer tous les équipements
  getAllEquipements: async () => {
    const response = await api.get(`${API_URL}/catalog/equipements`);
    return response.data;
  },

  // Creation service
  createService: async (nom: string, icone?: string) => {
    const response = await api.post(`${API_URL}/catalog/services`, { nom, icone });
    return response.data;
  },

  // Récupérer tous les services
  getAllServices: async () => {
    const response = await api.get(`${API_URL}/catalog/services`);
    return response.data;
  },

  // Liste des hotels
  getAllHotels: async () => {
    const response = await api.get(`${API_URL}/hotels`);
    return response.data;
  },

  //valider un hotel
  updateHotelStatus: async (idHotel: number, nouveauStatut: "valider" | "refuser") => {
    const response = await api.patch(`${API_URL}/hotels/${idHotel}/validate`, { statut: nouveauStatut });
    return response.data;
  }
};