export enum StatutHotel {
  BROUILLON = "brouillon",
  EN_ATTENTE = "en_attente",
  VALIDE = "valide",
  REJETE = "rejete",
}

export interface CreateHotel {
  nom: string;
  description: string;
  pays: string;
  ville: string;
  adresse: string;
  latitude: number;
  longitude: number;
  telephone: string;
  email?: string;
  nombreChambres: number;
  prixMin: number;
  prixMax: number;
  numeroRegistre: string;
  equipementsIds: number[];
  servicesIds: number[];
  visite3D?: visite3DScene[];
}

// export interface visite3DScene {
//   indexImage: number;
//   nomScene: string;
// }

export interface HotelResponse {
  idHotel: number;

  nom: string;
  description: string;

  pays: string;
  ville: string;
  adresse: string;

  latitude: number;
  longitude: number;

  telephone: string;
  email?: string;

  nombreChambres: number;
  prixMin: number;
  prixMax: number;

  numeroRegistre: string;

  statut: StatutHotel;
  estPublie: boolean;

  chefHotelId: number;

  creeLe: string;
  misAJourLe: string;
}

export interface ImageHotel {
  url: string;
  estPrincipale: boolean;
}

export interface DocumentHotel {
  nom: string;
  url: string;
  type: string;
}

export interface visite3DScene {
  identifiant: string;
  nom: string;
  imageUrl: string;
  points?: Points3D[];
}

export interface Points3D {
  label: string;
  versScene: string;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface CreateChambre {
  nom: string;
  description?: string;
  capacite: number;
  prix: number;
}

// export interface ChambreResponse extends CreateChambre {
//   idChambre: number;
//   hotelId: number;
//   creeLe: Date;
// }

export interface ManagerReservation {
  idReservation: number;
  client: {
    idUtilisateur: number;
    nom: string;
    email: string;
  };
  hotel: {
    idHotel: number;
    nom: string;
    ville: string;
  };
  chambre: {
    idChambre: number;
    nom: string;
  };
  dateArrivee: Date;
  dateDepart: Date;
  nombrePersonnes: number;
  montantTotal: number;
  statut: "en_attente" | "confirmée" | "annulée" | "complétée";
  creeLe: Date;
}