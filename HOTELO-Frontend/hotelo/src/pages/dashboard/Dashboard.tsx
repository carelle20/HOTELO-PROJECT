// pages/dashboard/Dashboard.tsx
import { useAuth } from "../../context/useAuth";
import DashboardClient from "./DashboardClient";
import DashboardHotelManager from "./DashboardHotelManager";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "HOTEL_MANAGER"
    ? <DashboardHotelManager />
    : <DashboardClient />;
}
