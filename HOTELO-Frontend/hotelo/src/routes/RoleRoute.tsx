// Verifie le role de l'uilisateur pour acceder a une route

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Role = "CLIENT" | "HOTEL_MANAGER";

export default function RoleRoute({
  role,
  children,
}: {
  role: Role;
  children: React.JSX.Element;
}) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
