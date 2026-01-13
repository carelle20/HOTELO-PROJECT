//fichier qui permet de verifier que l'utilisateur est connecte avant d'acceder a une route
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
}
