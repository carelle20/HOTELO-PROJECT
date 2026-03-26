import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps): ReactElement => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== "client") {
    return <Navigate to="/connexion" replace />;
  }

  return element;
};

export default ProtectedRoute;
