import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayouts";
import AdminDashboard from "../pages/admin/DashboardAdmin";
import AdminHotelManagers from "../pages/admin/AdminHotelManagers";
import CatalogHotel from "../pages/admin/CatalogHotel";
import AdminValidationHotels from "../pages/admin/ValidationHotel";

export const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="hotel-managers" element={<AdminHotelManagers />} />
    <Route 
      path="catalog/equipements" 
      element={<CatalogHotel type="equipements" title="Équipements" />} 
    />
    <Route 
      path="catalog/services" 
      element={<CatalogHotel type="services" title="Services" />} 
    />
    <Route path="hotels" element={<AdminValidationHotels/>} />
  </Route>
);
