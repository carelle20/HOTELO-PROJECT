export interface AdminStats {
  hotelsCount: number;
  managersCount: number;
  pendingValidationCount: number;
  totalBookings: number;
}

export interface HotelManager {
  idUtilisateur: number;
  prenom: string;
  nom: string;
  email: string;
  role: 'chef_hotel';
  estValide: boolean;
  creeLe: Date;
  profilChefHotel: {
    nom_hotel: string;
    adresse_hotel: string;
    telephone: string;
  } | null;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  updatedId?: number;
}