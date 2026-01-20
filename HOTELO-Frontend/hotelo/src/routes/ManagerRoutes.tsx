import { Route } from "react-router-dom";
import HotelManagerLayout from "../layouts/HotelManagerLayout";
import DashboardPage from "../pages/hotel-manager/DashboardPage";


export const ManagerRoutes = (
  <Route path="/manager" element={<HotelManagerLayout />}>
    <Route path="dashboard" element={<DashboardPage />} />
  </Route>
);
