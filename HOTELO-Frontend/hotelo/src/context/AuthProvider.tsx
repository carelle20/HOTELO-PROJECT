import { useState } from "react";
import { AuthContext } from "./auth.context";
import type{ User, UserRole } from "./auth.types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("auth_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email: string, role: UserRole) => {
    const fakeUser: User = {
      id: Date.now(),
      nom: role === "HOTEL_MANAGER" ? "Responsable Hôtel" : "Client",
      email,
      role,
    };

    setUser(fakeUser);
    localStorage.setItem("auth_user", JSON.stringify(fakeUser));
  };

  const register = (nom: string, email: string, role: UserRole) => {
    const newUser: User = {
      id: Date.now(),
      nom,
      email,
      role,
    };

    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
