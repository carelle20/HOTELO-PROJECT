//src/interfaces/manager.interface.ts
export interface ManagerDashboardStats {
  totalReservations: number;
  totalRevenusJour: number;
  totalPaiements: number;
  satisfactionMoyenne: number;
  reservationsEnAttente: RecentBooking[];
  reservationsConfirmees: RecentBooking[];
  dernieresMaj: string;
  missingImages?: boolean;
  missingRooms?: boolean;
  missing3DVisit?: boolean;
  qualityScore?: number;
}

export interface RecentBooking {
  idReservation: number;
  dateArrivee: string;
  dateDepart: string;
  montantTotal: number;
  statut: "en_attente" | "confirmée" | "annulée" | "refusée";
  client: {
    nom: string;
    prenom: string;
    email: string;
  };
  chambre: {
    nom: string;
    hotel?: {
      nom: string;
    };
  };
  hotel?: {
    idHotel: number;
    nom: string;
    ville?: string;
  };
}

export interface Hotel {
  idHotel: number;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  prixMin: number;
  prixMax: number;
  statut?: string;
  nombreChambres: number;
  _count: { chambres: number };
  images: { url: string; estPrincipale: boolean }[];
}

export interface ChambreData {
  idChambre: number;
  nom: string;
  description?: string;
  prix: number;
  capacite: number;
  images: { url: string }[];
  statut: "disponible" | "occupee";
}

// export interface HotelFormData {
//   nom: string;
//   description: string;
//   pays: string;
//   ville: string;
//   adresse: string;
//   latitude: number;
//   longitude: number;
//   telephone: string;
//   email?: string;
//   nombreChambres: number;
//   prixMin: number;
//   prixMax: number;
//   numeroRegistre: string;
//   equipementsIds: number[];
//   servicesIds: number[];
// }

export interface CatalogItem {
  idEquipement?: number;
  idService?: number;
  nom: string;
}

export interface ImageHotel {
  idImageHotel: number;
  url: string;
  estPrincipale: boolean;
  hotelId: number;
  creeLe: string;
}

export interface UploadResponse {
  message: string;
  images?: ImageHotel[];
}

export interface visite3DPoint {
  label: string;
  versScene: string;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface visite3DScene {
  identifiant: string;
  nom: string;
  image360Url: string;
  points: visite3DPoint[];
}