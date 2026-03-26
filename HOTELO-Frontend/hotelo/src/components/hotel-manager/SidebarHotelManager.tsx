// src/components/manager/Sidebar.tsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Star, 
  Wallet, 
  CreditCard, 
  Settings, 
  LogOut,
  Hotel,
  ChevronDown,
  ChevronRight,
  type LucideIcon
} from "lucide-react";

interface SubMenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path?: string;
  children?: SubMenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections = [
  {
    title: "MENU",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, path: "/manager/dashboard" },
      { 
        label: " Mes Hôtels", 
        icon: Hotel, 
        children: [
          { label: "Liste des hôtels", icon: List, path: "/manager/hotels" },
          { label: "Ajouter un hôtel", icon: PlusCircle, path: "/manager/hotels/create" },
        ]
      },
      { 
        label: "Chambres", 
        icon: BedDouble, 
        children: [
          { label: "Liste des chambres", icon: List, path: "/manager/chambres" },
          { label: "Nouvelle chambre", icon: PlusCircle, path: "/manager/chambres/create" },
        ]
      },
      { label: "Réservations", icon: CalendarCheck, path: "/manager/reservations" },
      { label: "Clients", icon: Users, path: "/manager/clients" },
      { label: "Avis clients", icon: Star, path: "/manager/avis" },
    ],
  },
  {
    title: "FINANCES",
    items: [
      { label: "Revenus", icon: Wallet, path: "/manager/caisse" },
      { label: "Factures & Paiements", icon: CreditCard, path: "/manager/invoices" },
    ],
  },
];

// Composant pour gérer les items simples ou avec sous-menus
const SidebarItem = ({ item }: { item: MenuItem }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    return item.children?.some((child: SubMenuItem) => location.pathname === child.path) || false;
  });

  const Icon = item.icon;

  if (item.children) {
    const isChildActive = item.children.some((child: SubMenuItem) => location.pathname === child.path);

    return (
      <li className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
            isChildActive 
              ? "bg-[#0B1E3A]/5 text-[#0B1E3A] font-medium" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-[#0B1E3A]" />
            <span className="text-sm">{item.label}</span>
          </div>
          {isOpen ? <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}>
              <ChevronDown size={14} />
            </div>: <ChevronRight size={14} />}
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-1" : "max-h-0"}`}>
          <ul className="ml-9 space-y-1 border-l border-gray-100">
            {item.children.map((child: SubMenuItem) => (
              <li key={child.label}>
                <NavLink
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-[#F4B400] font-semibold"
                        : "text-gray-500 hover:text-[#0B1E3A] hover:bg-gray-50"
                    }`
                  }
                >
                  <child.icon size={14} />
                  <span>{child.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path || "#"}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
            isActive
              ? "bg-[#0B1E3A]/10 text-[#0B1E3A] font-medium border-l-4 border-[#F4B400] rounded-l-none"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
      >
        <Icon size={18} className="text-[#0B1E3A]" />
        <span className="text-sm">{item.label}</span>
      </NavLink>
    </li>
  );
};

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* ... Header HOTELO ... */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar">
        {(menuSections as MenuSection[]).map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-1">
        <NavLink 
          to="/manager/settings" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive ? "bg-gray-100 text-[#0B1E3A]" : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Settings size={18} /> <span className="text-sm">Paramètres</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} /> <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}