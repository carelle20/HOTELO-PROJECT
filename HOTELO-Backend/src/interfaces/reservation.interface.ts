export type StatutReservation = "en_attente" | "confirmée" | "annulée" | "complétée";
export type StatutFacture = "générée" | "payée" | "annulée";
export type TypeCaisse = "revenus" | "dépenses" | "ajustement";


export interface CreateReservationRequest {
  chambreId: number;
  hotelId: number;
  dateArrivee: string;
  dateDepart: string; 
  nombrePersonnes: number;
}

export interface ReservationResponse {
  idReservation: number;
  dateArrivee: Date;
  dateDepart: Date;
  nombreNuits: number;
  nombrePersonnes: number;
  statut: StatutReservation;
  prixUnitaire: number;
  montantTotal: number;
  clientId: number;
  chambreId: number;
  hotelId: number;
  creeLe: Date;
  misAJourLe: Date;
}

export interface Reservation {
  idReservation: number;
  dateArrivee: Date;
  dateDepart: Date;
  nombreNuits: number;
  nombrePersonnes: number;
  statut: StatutReservation;
  motifAnnulation?: string | null;
  prixUnitaire: number;
  montantTotal: number;
  clientId: number;
  chambreId: number;
  hotelId: number;
  creeLe: Date;
  misAJourLe: Date;
  // Relations
  client?: {
    idUtilisateur: number;
    prenom: string;
    nom: string;
    email: string;
  };
  chambre?: {
    idChambre: number;
    nom: string;
    capacite: number;
    prix: number;
  };
  hotel?: {
    idHotel: number;
    nom: string;
    ville: string;
    adresse: string;
  };
  factures?: Facture[];
}

export interface FactureRequest {
  reservationId: number;
  montantHT: number;
  tva?: number; 
}

export interface Facture {
  idFacture: number;
  numeroFacture: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  statut: StatutFacture;
  datePaiement?: Date;
  reservationId: number;
  hotelId: number;
  clientId: number;
  urlPDF?: string;
  creeLe: Date;
  misAJourLe: Date;
  reservation?: Reservation;
  client?: {
    idUtilisateur: number;
    prenom: string;
    nom: string;
    email: string;
  };
  hotel?: {
    idHotel: number;
    nom: string;
  };
}

export interface EntreeCaisseRequest {
  type: TypeCaisse;
  description: string;
  montant: number;
  hotelId: number;
  reservationId?: number;
  justificatifUrl?: string;
}

export interface EntreeCaisse {
  idCaisse: number;
  type: TypeCaisse;
  description: string;
  montant: number;
  statut: string;
  hotelId: number;
  reservationId?: number;
  factureId?: number;
  justificatifUrl?: string;
  creeLe: Date;
  misAJourLe: Date;
  creePar: number;
}

export interface StatistiquesCaisse {
  totalRevenus: number;
  totalDépenses: number;
  solde: number;
  nombreReservations: number;
  reservationConfirmées: number;
  montantEnAttente: number;
}

export interface DisponibiliteRequest {
  chambreId: number;
  dateArrivee: string; 
  dateDepart: string; 
}

export interface DisponibiliteChambre {
  date: Date;
  disponible: boolean;
  raison?: string;
  chambreId: number;
  reservationId?: number;
}

export interface ReponseDisponibilite {
  chambreId: number;
  chambreName: string;
  dateArrivee: string;
  dateDepart: string;
  disponible: boolean;
  raisons: string[];
  nuitsSansDisponibilite: string[]; 
}

export interface AvisRequest {
  titre?: string;
  commentaire: string;
  note: number; 
  hotelId: number;
  reservationId?: number;
}

export interface Avis {
  idAvis: number;
  titre?: string;
  commentaire: string;
  note: number;
  clientId: number;
  hotelId: number;
  reservationId?: number;
  estModere: boolean;
  creeLe: Date;
  misAJourLe: Date;
  client?: {
    idUtilisateur: number;
    prenom: string;
    nom: string;
  };
  hotel?: {
    idHotel: number;
    nom: string;
  };
}

export interface DashboardClientResponse {
  totalReservations: number;
  upcomingStays: number;
  cancelledReservations: number;
  totalSpent: number;
  upcomingReservations: Reservation[];
  recentReviews: Avis[];
}

export interface DashboardChefHotelResponse {
  totalReservations: number;
  reservationEnAttente: number;
  reservationConfirmees: number;
  reservationAnnulees: number;
  montantEnAttente: number;
  montantConfirme: number;
  caisseTotal: number;
  taux_occupation: number; 
  note_moyenne: number;
  reservationsRecentes: Reservation[];
  entreesCaisseRecentes: EntreeCaisse[];
  statistiques: StatistiquesCaisse;
}

export interface ValidationReservationRequest {
  idReservation: number;
  valider: boolean; 
  motifRefus?: string;
}

export interface ConfirmationPaiementRequest {
  idFacture: number;
  methodePaiement: string; 
  datePaiement?: string;
}

export interface StatsReservation {
  total: number;
  parMois: { mois: string; nombre: number }[];
  parStatut: { statut: StatutReservation; nombre: number }[];
  revenus: {
    total: number;
    parMois: { mois: string; montant: number }[];
  };
  occupancy: {
    taux: number; 
    nuitesReservees: number;
    nuitesTotales: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
