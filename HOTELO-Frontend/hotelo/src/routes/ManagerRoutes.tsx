import { Route } from "react-router-dom";
import HotelManagerLayout from "../layouts/HotelManagerLayout";
import DashboardPage from "../pages/hotel-manager/DashboardPage";
import MesHotelsPage from "../pages/hotel-manager/MonHotelPage";
import ChambresPage from "../pages/hotel-manager/ChambresPage";
import GestionImagesChambre from "../pages/hotel-manager/GesionImagesChambre";


export const ManagerRoutes = (
  <Route path="/manager" element={<HotelManagerLayout />}>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="hotels" element={<MesHotelsPage />} />
    <Route path="chambres" element={<ChambresPage />} />
    <Route path="chambres/images" element={<GestionImagesChambre />} />
  </Route>
);
