import api from "../api/axios";
import {type  Hotel } from "../interfaces/client.interface";

export const hotelService = {
  // Récupérer tous les hôtels publiés et validés
  getAllHotels: async (): Promise<Hotel[]> => {
    try {
      const response = await api.get<Hotel[]>("/public/hotels");
      return response.data;
    } catch (error) {
      console.error("Erreur getAllHotels:", error);
      throw error;
    }
  },

  // Récupérer un hôtel par son ID 
  getHotelById: async (id: number): Promise<Hotel> => {
    try {
      const response = await api.get<Hotel>(`/public/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur getHotelById:", error);
      throw error;
    }
  },

  // Récupérer les hôtels pour la page d'accueil (6 derniers)
  getHotelsForHomepage: async (): Promise<Hotel[]> => {
    try {
      const response = await api.get<Hotel[]>("/public/homepage");
      return response.data;
    } catch (error) {
      console.error("Erreur getHotelsForHomepage:", error);
      throw error;
    }
  },

  // Rechercher des hôtels par ville
  searchHotelsByCity: async (city: string): Promise<Hotel[]> => {
    try {
      const response = await api.get<Hotel[]>("/public/search", {
        params: { city }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur searchHotelsByCity:", error);
      throw error;
    }
  }
};