import { useState } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 relative">
      
      {/* Titre */}
      <h1 className="text-lg font-semibold text-gray-800">
        Espace Responsable d’hôtel
      </h1>

      {/* Menu profil */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
        >
          <div className="w-8 h-8 rounded-full bg-[#0B1E3A] text-[#F4B400] flex items-center justify-center">
            <User size={16} />
          </div>

          <span className="text-sm font-medium text-gray-700">
            Responsable
          </span>

          <ChevronDown size={16} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
            
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

            <button
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut size={16} />
              Déconnexion
            </button>

          </div>
        )}
      </div>
    </header>
  );
}
