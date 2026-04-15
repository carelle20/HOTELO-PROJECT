import type { ReactElement } from "react";
import { Route, Navigate } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import DashboardClient from "../pages/client/DashboardClient";
import ReservationsPage from "../pages/client/ReservationsPage";
import ProfilePage from "../pages/client/ProfilePage";
import FavoritesPage from "../pages/client/FavoritesPage";
import ReviewsPage from "../pages/client/ReviewsPage";
import SettingsPage from "../pages/client/SettingsPage";

export const ClientRoutes: ReactElement[] = [
  // Dashboard
  <Route
    key="client-dashboard"
    path="/client/dashboard"
    element={
      <ProtectedRoute
        element={
          <ClientLayout>
            <DashboardClient />
          </ClientLayout>
        }
      />
    }
  />,

  // Reservations
  <Route
    key="client-reservations"
    path="/client/reservations"
    element={
      <ProtectedRoute
        element={
          <ClientLayout>
            <ReservationsPage />
          </ClientLayout>
        }
      />
    }
  />,

  // Profile
  <Route
    key="client-profile"
    path="/client/profile"
    element={
      <ProtectedRoute
        element={
          <ClientLayout>
            <ProfilePage />
          </ClientLayout>
        }
      />
    }
  />,

  // Favorites
  <Route
    key="client-favorites"
    path="/client/favorites"
    element={
      <ProtectedRoute
        element={
          <ClientLayout>
            <FavoritesPage />
          </ClientLayout>
        }
      />
    }
  />,

  // Reviews
  <Route
    key="client-reviews"
    path="/client/reviews"
    element={
      <ProtectedRoute
        element={
          <ClientLayout>
            <ReviewsPage />
          </ClientLayout>
        }
      />
    }
  />,

  // Settings
  <Route
    key="client-settings"
    path="/client/settings"
    element={
      <ProtectedRoute
        element={
          <ClientLayout>
            <SettingsPage />
          </ClientLayout>
        }
      />
    }
  />,

  <Route
    key="client-redirect"
    path="/client"
    element={<Navigate to="/client/dashboard" replace />}
  />,
];
