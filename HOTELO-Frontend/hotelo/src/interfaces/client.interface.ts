export interface Equipement {
  idEquipement: number;
  nom: string;
  icone?: string;
}

export interface Service {
  idService: number;
  nom: string;
  icone?: string;
}

export interface ImageHotel {
  idImageHotel: number;
  url: string;
  estPrincipale?: boolean;
}

export interface Chambre {
  idChambre: number;
  nom: string;
  description?: string;
  capacite: number;
  prix: number;
  statut: string;
  images?: ImageHotel[];
}

export interface Hotel {
  idHotel: number;
  nom: string;
  description: string;
  pays: string;
  ville: string;
  adresse?: string;
  latitude: number;
  longitude: number;
  telephone?: string;
  email?: string;
  nombreChambres: number;
  prixMin: number;
  prixMax: number;
  numeroRegistre: string;
  equipementsIds?: number[];
  servicesIds?: number[];
  images: ImageHotel[];
  equipements?: Equipement[];
  services?: Service[];
  chambres?: Chambre[];
  visite3D?: visite3DScene[];
}

export interface visite3DScene {
  identifiant: string;
  nom: string;
  image360Url: string;
  points?: Points3D[];
}

export interface Points3D {
  label: string;
  versScene: string;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface ClientDashboardStats {
  totalReservations: number;
  upcomingStays: number;
  cancelledReservations: number;
  totalSpent: number;
}

export interface Reservation {
  idReservation: number;
  dateArrivee: string;
  dateDepart: string;
  statut: "confirmée" | "annulée" | "en_attente" | "complétée";
  montantTotal: number;
  nombreNuits: number;
  chambreId: number;
  hotelId: number;
  clientId: number;
  creeLe: string;
  misAJourLe: string;
  chambre?: Chambre;
  hotel?: {
    nom: string;
    ville: string;
    adresse: string;
  };
}

export interface ReservationRequest {
  chambreId: number;
  hotelId: number;
  dateArrivee: string;
  dateDepart: string;
  nombreNuits: number;
  montantTotal: number;
  nombrePersonnes?: number;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  reservation?: Reservation;
}

export interface Review {
  idAvis: number;
  note: number;
  commentaire: string;
  hotelId: number;
  clientId: number;
  creeLe: string;
  misAJourLe: string;
}

export interface ReviewRequest {
  note: number;
  commentaire: string;
  hotelId: number;
}