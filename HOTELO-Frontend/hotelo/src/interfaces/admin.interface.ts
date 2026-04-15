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
  estValide: boolean;
  creeLe: string;
  profilChefHotel: {
    nom_hotel: string;
    adresse_hotel: string;
    telephone: string;
  } | null;
}

export interface CatalogItem {
  idEquipement?: number;
  idService?: number;
  nom: string;
  icone: string | null;
}

export interface CatalogHotelProps {
  type: "equipements" | "services";
  title: string;
}