import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Header() {
  const [openProfile, setOpenProfile] = useState(false);
  const { user, logout } = useAuth(); // Récupération des données réelles
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Center: Search */}
      <div className="hidden md:flex flex-1 justify-center px-6">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Rechercher une réservation, un client, une chambre..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]/20"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Language */}
        <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
          FR
        </button>

        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile avec détection de survol (Hover) */}
        <div 
          className="relative"
          onMouseEnter={() => setOpenProfile(true)}
          onMouseLeave={() => setOpenProfile(false)}
        >
          <button className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4B400] flex items-center justify-center text-[#0B1E3A] font-bold uppercase">
              {/* Initiales dynamiques avec fallback */}
              {user ? `${user.prenom[0]}${user.nom[0]}` : "RH"}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {user ? `${user.prenom} ${user.nom}` : "Responsable Hôtel"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "manager@hotelo.cm"}
              </p>
            </div>

            <ChevronDown 
              size={18} 
              className={`text-gray-500 transition-transform ${openProfile ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown menu */}
          {openProfile && (
            <div className="absolute right-0 mt-0 pt-3 w-56 z-50"> 
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to="/manager/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} />
                  Mon profil
                </Link>

                <Link
                  to="/manager/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  Paramètres
                </Link>

                <Link
                  to="/manager/help"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <HelpCircle size={16} />
                  Aide & support
                </Link>

                <div className="border-t border-gray-200">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}