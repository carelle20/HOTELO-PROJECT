import { Route } from "react-router-dom";
import HotelManagerLayout from "../layouts/HotelManagerLayout";
import DashboardPage from "../pages/hotel-manager/DashboardPage";
import ChambresPage from "../pages/hotel-manager/ChambresPage";
import GestionImagesChambre from "../pages/hotel-manager/GesionImagesChambre";
import CreateHotel from "../pages/hotel-manager/hotels/CreateHotel";
import HotelsList from "../pages/hotel-manager/hotels/HotelsList";
import ImagesHotel from "../pages/hotel-manager/hotels/ImagesHotel";
import EditHotel from "../pages/hotel-manager/hotels/EditHotel";
import CreateChambre from "../pages/hotel-manager/chambres/CreateChambre";
import DetailsHotel from "../pages/hotel-manager/hotels/DetailsHotel";
import ReservationsListPage from "../pages/hotel-manager/ReservationsListPage";
import ReservationDetailPage from "../pages/hotel-manager/ReservationDetailPage";


export const ManagerRoutes = (
  <Route path="/manager" element={<HotelManagerLayout />}>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route index element={<DashboardPage />} />
    <Route path="hotels/create" element={<CreateHotel />} />
    <Route path="hotels" element={<HotelsList />} />
    <Route path="hotels/:idHotel/details" element={<DetailsHotel />} />
    <Route path="hotels/edit/:idHotel" element={<EditHotel />} />
    <Route path="hotels/:idHotel/chambres/create" element={<CreateChambre />} />
    <Route path="chambres" element={<ChambresPage />} />
    <Route path="chambres/images" element={<GestionImagesChambre />} />
    <Route path="hotels/:idHotel/images" element={<ImagesHotel/>} />
    <Route path="reservations" element={<ReservationsListPage />} />
    <Route path="reservations/:id" element={<ReservationDetailPage />} />
  </Route>
);
