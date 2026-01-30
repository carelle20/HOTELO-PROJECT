// src/components/admin/AdminTopbar.tsx
import { useState } from "react";
import { Bell, ChevronDown, Search, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function AdminTopbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const { user, logout } = useAuth(); // Récupération des données réelles
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-lg font-bold text-[#0B1E3A]">Administration</h1>

      <div className="hidden md:flex flex-1 justify-center px-6">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un hôtel, responsable..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#0B1E3A]/10 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-[#0B1E3A]">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="relative">
          <button onClick={() => setOpenProfile(!openProfile)} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#0B1E3A] text-yellow-400 flex items-center justify-center font-bold shadow-sm">
              {user?.prenom[0]}{user?.nom[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                {user?.role}
              </p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${openProfile ? 'rotate-180' : ''}`} />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-slate-50">
                <User size={16} /> Mon Profil
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100">
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}