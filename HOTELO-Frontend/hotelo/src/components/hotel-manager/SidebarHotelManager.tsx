import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  LayoutDashboard,
  Hotel,
  BedDouble,
  CalendarCheck,
  Users,
  Star,
  Wallet,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const menuSections = [
  {
    title: "MENU",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, path: "/manager/dashboard" },
      { label: "Mes hôtels", icon: Hotel, path: "/manager/hotels" },
      { label: "Chambres", icon: BedDouble, path: "/manager/rooms" },
      { label: "Réservations", icon: CalendarCheck, path: "/manager/bookings" },
      { label: "Clients", icon: Users, path: "/manager/clients" },
      { label: "Avis", icon: Star, path: "/manager/reviews" },
    ],
  },
  {
    title: "FINANCES",
    items: [
      { label: "Revenus", icon: Wallet, path: "/manager/revenue" },
      { label: "Paiements", icon: CreditCard, path: "/manager/payments" },
    ],
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      
      {/* Logo - Zone fixe */}
      <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-[#0B1E3A]">
          HOT<span className="text-[#F4B400]">ELO</span>
        </span>
      </div>

      {/* Navigation - Zone flexible qui scrolle si besoin */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase">
              {section.title}
            </p>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#0B1E3A]/10 text-[#0B1E3A] font-medium border-l-4 border-[#F4B400] rounded-l-none"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon
                        size={18}
                        className="text-[#0B1E3A]"
                      />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pied de page - Fixé en bas sans espace blanc superflu */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-1">
        <NavLink
          to="/manager/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Settings size={18} />
          <span className="text-sm">Paramètres</span>
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
