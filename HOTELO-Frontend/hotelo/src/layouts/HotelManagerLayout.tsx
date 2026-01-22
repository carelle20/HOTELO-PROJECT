import { Outlet } from "react-router-dom";
import Sidebar from "../components/hotel-manager/SidebarHotelManager";
import Topbar from "../components/hotel-manager/TopbarHotelManager";

export default function HotelManagerLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
