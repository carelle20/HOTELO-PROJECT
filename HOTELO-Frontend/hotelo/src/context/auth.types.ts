export type UserRole = "CLIENT" | "HOTEL_MANAGER";

export interface User {
  id: number;
  nom: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  register: (nom: string, email: string, role: UserRole) => void;
  logout: () => void;
}
