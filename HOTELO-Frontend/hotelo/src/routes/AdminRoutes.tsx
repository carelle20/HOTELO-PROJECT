import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayouts";
import AdminDashboard from "../pages/admin/DashboardAdmin";
import AdminHotelManagers from "../pages/admin/AdminHotelManagers";

export const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="hotel-managers" element={<AdminHotelManagers />} />
  </Route>
);
