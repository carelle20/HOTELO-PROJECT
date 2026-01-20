import { Outlet } from "react-router-dom";
import Sidebar from "../components/hotel-manager/SidebarHotelManager";
import Topbar from "../components/hotel-manager/TopbarHotelManager";

export default function HotelManagerLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Topbar />

        <main className="p-6">
            {/* Affichage du contenu des pages enfants */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
