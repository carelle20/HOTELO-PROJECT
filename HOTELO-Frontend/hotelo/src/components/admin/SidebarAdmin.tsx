// src/components/admin/AdminSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Hotel, UserCheck, CalendarCheck, Wallet, CreditCard, AlertTriangle, LogOut, LifeBuoy } from "lucide-react";
import { useAuth } from "../../context/useAuth";

const sections = [
  {
    title: "MENU",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
      { label: "Utilisateurs", icon: Users, path: "/admin/users" },
      { label: "Responsables hôtels", icon: UserCheck, path: "/admin/hotel-managers" },
      { label: "Hôtels", icon: Hotel, path: "/admin/hotels" },
      { label: "Réservations", icon: CalendarCheck, path: "/admin/bookings" },
    ],
  },
  {
    title: "PLATEFORME",
    items: [
      { label: "Revenus", icon: Wallet, path: "/admin/revenue" },
      { label: "Paiements", icon: CreditCard, path: "/admin/payments" },
      { label: "Avis & signalements", icon: AlertTriangle, path: "/admin/reports" },
    ],
  },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-black text-[#0B1E3A]">
          HOT<span className="text-yellow-500">ELO</span> <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded ml-2 text-slate-500">ADMIN</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">
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
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                          isActive
                            ? "bg-[#0B1E3A]/10 text-[#0B1E3A] border-l-4 border-[#F4B400]"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-4 space-y-1">
        <NavLink
          to="/admin/support"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <LifeBuoy size={18} />
          Support
        </NavLink>        
        <button 
          onClick={() => { logout(); navigate("/connexion"); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 font-bold text-sm transition-colors"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}