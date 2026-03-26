export interface Hotel {
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