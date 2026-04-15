import api from "../api/axios";
import type { ManagerDashboardStats, Hotel, RecentBooking, ImageHotel, ChambreData } from "../interfaces/manager.interface";

const API_URL = "/manager";

export const managerService = {
  /* Récuperation des donnees pour le dashboard */
  getDashboardStats: async (): Promise<ManagerDashboardStats> => {
    const response = await api.get(`${API_URL}/dashboard`);
    return response.data.data;
  },

    // ajout d'un hotel
  createHotel: async (hotelData: FormData) => {
    const response = await api.post(`${API_URL}/hotels/create`, hotelData, {
      headers: {"Content-Type": "multipart/form-data"},
    });
    return response.data;
  },

  // Récuperation des hôtels du chef connecté
  getMyHotels: async (): Promise<Hotel[]> => {
    const response = await api.get(`${API_URL}/hotels`);
    return response.data;
  },

  // Récupération des données d'un hôtel spécifique
  getHotelById: async (id: string | number): Promise<Hotel> => {
    const response = await api.get(`${API_URL}/hotels/${id}`);
    return response.data;
  },

  // Pour envoyer les modifications
  updateHotel: async (id: string | number, data: FormData) => {
    const response = await api.put(`${API_URL}/hotels/${id}/edit`, data);
    return response.data;
  },

  // Images d'un hôtel
  async uploadHotelImages(idHotel: string | number, formData: FormData): Promise<ImageHotel[]> {
    const response = await api.post(`${API_URL}/hotels/${idHotel}/images`, formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Catalogue de services et équipements
  getCatalog: async () => {
    const [eq, ser] = await Promise.all([
      api.get("http://localhost:5000/api/admin/catalog/equipements"),
      api.get("http://localhost:5000/api/admin/catalog/services")
    ]);
    return { equipements: eq.data, services: ser.data };
  },

  // Récupère les images d'un hôtel
  async getHotelImages(idHotel: string | number): Promise<ImageHotel[]> {
    const response = await api.get<ImageHotel[]>(`${API_URL}/hotels/${idHotel}/images`);
    return response.data;
  },

  // Creation d'une chambre
  createChambre: async (idHotel: string | number, data: FormData) => {
    const response = await api.post(`${API_URL}/hotels/${idHotel}/chambres`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Récupération des chambres d'un hôtel
  getChambresByHotel: async (idHotel: string | number): Promise<ChambreData[]> => {
    const response = await api.get(`${API_URL}/hotels/${idHotel}/chambres`);
    return response.data;
  },

  /* Récupère les réservations en attente */
  getPendingReservations: async (): Promise<RecentBooking[]> => {
    const response = await api.get(`${API_URL}/reservations/pending`);
    return response.data.data;
  },

  confirmReservation: async (idReservation: number) => {
    const response = await api.post(`${API_URL}/reservations/${idReservation}/confirm`);
    return response.data;
  },

  rejectReservation: async (idReservation: number, motif: string) => {
    const response = await api.post(`${API_URL}/reservations/${idReservation}/reject`, { motif });
    return response.data;
  },

};