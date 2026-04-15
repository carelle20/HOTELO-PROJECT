import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Star,
  MessageSquare,
  type LucideIcon,
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

const menuSections: MenuSection[] = [
  {
    title: "MENU",
    items: [
      {
        label: "Tableau de bord",
        icon: LayoutDashboard,
        path: "/client/dashboard",
      },
      {
        label: "Mes réservations",
        icon: CalendarCheck,
        path: "/client/reservations",
      },
      { label: "Mes favoris", icon: Heart, path: "/client/favorites" },
      { label: "Mes avis", icon: Star, path: "/client/reviews" },
    ],
  },
  {
    title: "COMPTE",
    items: [
      { label: "Mon profil", icon: User, path: "/client/profile" },
      { label: "Paramètres", icon: MessageSquare, path: "/client/settings" },
    ],
  },
];

// Composant pour gérer les items simples ou avec sous-menus
const SidebarItem = ({ item }: { item: MenuItem }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    return item.children?.some((child) => location.pathname === child.path) || false;
  });

  const Icon = item.icon;

  if (item.children) {
    const isChildActive = item.children.some(
      (child) => location.pathname === child.path
    );

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
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && item.children && (
          <ul className="mt-1 ml-4 border-l border-gray-200 space-y-1">
            {item.children.map((sub) => (
              <li key={sub.label}>
                <NavLink
                  to={sub.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      isActive
                        ? "text-[#0B1E3A] font-bold bg-slate-50 border-l-2 border-[#0B1E3A]"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <sub.icon size={16} />
                  <span className="text-xs">{sub.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path || "/"}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
            isActive
              ? "text-[#0B1E3A] font-bold bg-slate-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`
        }
      >
        <Icon size={18} />
        <span className="text-sm">{item.label}</span>
      </NavLink>
    </li>
  );
};

export default function ClientSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-black text-[#0B1E3A]">
          HOT<span className="text-yellow-500">ELO</span>{" "}
          <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded ml-2 text-blue-600">
            CLIENT
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">
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

      {/* Footer - Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
