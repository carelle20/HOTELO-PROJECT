// src/context/auth.types.ts

export type UserRole = "client" | "chef_hotel" | "admin" | "super_admin";
export type DateTime = string;

export interface User {
  idUtilisateur: number;
  prenom: string;
  nom: string;
  email: string;
  role: UserRole;
  creeLe: DateTime;
  estChefHotel?: boolean;
  estValide?: boolean;
}

// Interface pour les données reçues après une connexion réussie
export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  nouveauMdpAuto?: string | null;
  message?: string;
}

// Interface pour les données d'inscription
export interface RegisterData {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  role: UserRole;
  nomHotel?: string;
  adresseHotel?: string;
  telephone?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, motDePasse: string) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}