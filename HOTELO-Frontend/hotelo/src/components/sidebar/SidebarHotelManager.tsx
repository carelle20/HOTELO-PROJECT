import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function SidebarHotelManager() {
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col gap-4 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10"
      >
        <LayoutDashboard size={18} />
        Tableau de bord
      </Link>

      <Link
        to="/dashboard/hotels/create"
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10"
      >
        <Hotel size={18} />
        Ajouter un hôtel
      </Link>

      <Link
        to="/reservations"
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10"
      >
        <Calendar size={18} />
        Réservations
      </Link>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-300 mt-6"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </nav>
  );
}
