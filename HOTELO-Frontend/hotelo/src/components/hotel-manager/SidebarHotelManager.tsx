import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Hotel,
  BedDouble,
  CalendarCheck,
  Star,
  Settings
} from "lucide-react";

const links = [
  { label: "Tableau de bord", icon: LayoutDashboard, to: "/manager/dashboard" },
  { label: "Mon hôtel", icon: Hotel, to: "/manager/hotel" },
  { label: "Chambres", icon: BedDouble, to: "/manager/rooms" },
  { label: "Réservations", icon: CalendarCheck, to: "/manager/bookings" },
  { label: "Avis clients", icon: Star, to: "/manager/reviews" },
  { label: "Paramètres", icon: Settings, to: "/manager/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0B1E3A] text-white min-h-screen fixed">
      <div className="p-6 text-xl font-bold text-[#F4B400]">
        HOTEO Manager
      </div>

      <nav className="flex flex-col gap-1 px-4">
        {links.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
               ${
                 isActive
                   ? "bg-[#F4B400] text-[#0B1E3A] font-semibold"
                   : "hover:bg-white/10"
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
