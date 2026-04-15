import api from "../api/axios";
import type {
  ClientDashboardStats,
  Reservation,
  ReservationRequest,
  ReservationResponse,
  ReviewRequest,
  Review,
  Hotel,
} from "../interfaces/client.interface";

const API_BASE = "http://localhost:5000/api/client";

export const clientService = {
  /* Récupère le dashboard du client avec statistiques */
  getDashboardStats: async (): Promise<ClientDashboardStats> => {
    try {
      const response = await api.get(`${API_BASE}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  /* Récupère toutes les réservations du client */
  getMyReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await api.get<{ data: Reservation[] }>(`${API_BASE}/reservations`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  },

  /* Récupère les détails d'une réservation spécifique */
  getReservationById: async (id: number): Promise<Reservation> => {
    try {
      const response = await api.get<{ data: Reservation }>(
        `${API_BASE}/reservations/${id}`
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching reservation:", error);
      throw error;
    }
  },

  /* Crée une nouvelle réservation */
  createReservation: async (
    data: ReservationRequest
  ): Promise<ReservationResponse> => {
    try {
      const response = await api.post<{ data: ReservationResponse }>(
        `${API_BASE}/reservations`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },

  /* Annule une réservation */
  cancelReservation: async (id: number, motif?: string): Promise<ReservationResponse> => {
    try {
      const response = await api.delete<{ success: boolean; message: string; data?: Reservation }>(
        `${API_BASE}/reservations/${id}`,
        {
          data: { motif }
        }
      );
      return {
        success: response.data.success,
        message: response.data.message,
        reservation: response.data.data
      };
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      throw error;
    }
  },

  /* met à jour une réservation */
  updateReservation: async (id: number, data: Partial<Reservation>): Promise<{ success: boolean; message: string; data: Reservation }> => {
    try {
      const response = await api.patch<{ success: boolean; message: string; data: Reservation }>(
        `${API_BASE}/reservations/${id}`, 
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erreur Service Frontend Update:", error);
      throw error;
    }
  },

  /* Récupère les réservations futures d'un client */
  getUpcomingReservations: async (): Promise<Reservation[]> => {
    try {
      const allReservations = await clientService.getMyReservations();
      return allReservations.filter(
        (r) => new Date(r.dateArrivee) > new Date() && r.statut === "confirmée"
      );
    } catch (error) {
      console.error("Error fetching upcoming reservations:", error);
      throw error;
    }
  },

  /* Récupère l'historique des réservations passées */
  getPastReservations: async (): Promise<Reservation[]> => {
    try {
      const allReservations = await clientService.getMyReservations();
      return allReservations.filter(
        (r) => new Date(r.dateDepart) < new Date()
      );
    } catch (error) {
      console.error("Error fetching past reservations:", error);
      throw error;
    }
  },

  /* Ajoute un avis pour un hôtel */
  addReview: async (data: ReviewRequest): Promise<Review> => {
    try {
      const response = await api.post<{ data: Review }>(
        `${API_BASE}/reviews`,
        data
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  /* Récupère les avis laissés par le client */
  getMyReviews: async (): Promise<Review[]> => {
    try {
      const response = await api.get<{ data: Review[] }>(`${API_BASE}/reviews`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  /* Met à jour un avis */
  updateReview: async (
    id: number,
    data: Partial<ReviewRequest>
  ): Promise<Review> => {
    try {
      const response = await api.put<{ data: Review }>(
        `${API_BASE}/reviews/${id}`,
        data
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  /* Supprime un avis */
  deleteReview: async (id: number): Promise<void> => {
    try {
      await api.delete(`${API_BASE}/reviews/${id}`);
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  /* Met à jour le profil du client */
  updateProfile: async (
    data: Partial<{
      prenom: string;
      nom: string;
      telephone?: string;
    }>
  ): Promise<{ success: boolean }> => {
    try {
      const response = await api.put<{ data: { success: boolean } }>(`${API_BASE}/profile`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  /* Récupère les détails du profil client */
  getProfile: async (): Promise<{ prenom: string; nom: string; email: string }> => {
    try {
      const response = await api.get<{ data: { prenom: string; nom: string; email: string } }>(`${API_BASE}/profile`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /* Récupère les hôtels favoris du client */
  getFavoriteHotels: async (): Promise<Hotel[]> => {
    try {
      const response = await api.get<{ data: Hotel[] }>(`${API_BASE}/favorites`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching favorite hotels:", error);
      throw error;
    }
  },

  /* Ajoute un hôtel aux favoris */
  addToFavorites: async (hotelId: number): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ data: { success: boolean } }>(`${API_BASE}/favorites`, { hotelId });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  },

  /* Retire un hôtel des favoris */
  removeFromFavorites: async (hotelId: number): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete<{ data: { success: boolean } }>(`${API_BASE}/favorites/${hotelId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  },

  /* Récupère les factures du client */
  getMyInvoices: async (): Promise<Array<{ idFacture: number; numeroFacture: string; montantTTC: number; statut: string }>> => {
    try {
      const response = await api.get<{ data: Array<{ idFacture: number; numeroFacture: string; montantTTC: number; statut: string }> }>(`${API_BASE}/invoices`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  /* Récupère une facture spécifique */
  getInvoiceById: async (id: number): Promise<{ idFacture: number; numeroFacture: string; montantTTC: number; statut: string }> => {
    try {
      const response = await api.get<{ data: { idFacture: number; numeroFacture: string; montantTTC: number; statut: string } }>(`${API_BASE}/invoices/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  },

  /* Télécharge une facture en PDF */
  downloadInvoice: async (id: number): Promise<string> => {
    try {
      const response = await api.get<{ data: { urlPDF: string } }>(`${API_BASE}/invoices/${id}/download`);
      return response.data.data.urlPDF;
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error;
    }
  },

  /* Vérifie la disponibilité des chambres */
  checkAvailability: async (
    chambreId: number,
    dateArrivee: string,
    dateDepart: string
  ): Promise<{ disponible: boolean; raisons: string[] }> => {
    try {
      const response = await api.post<{ data: { disponible: boolean; raisons: string[] } }>(
        `${API_BASE}/check-availability`,
        { chambreId, dateArrivee, dateDepart }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;
    }
  },
};
