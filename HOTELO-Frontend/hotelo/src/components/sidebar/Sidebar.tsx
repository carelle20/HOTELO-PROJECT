import { useAuth } from "../../context/useAuth";
import SidebarClient from "./SidebarClient";
import SidebarHotelManager from "./SidebarHotelManager";


export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-64 bg-[#0B1E3A] text-white hidden md:flex flex-col p-6">
      {/* Logo */}
      <div className="text-2xl font-bold text-yellow-400 mb-10">
        HOTELO
      </div>

      {user.role === "HOTEL_MANAGER" ? (
        <SidebarHotelManager />
      ) : (
        <SidebarClient />
      )}
    </aside>
  );
}
