import { useAuth } from "../../context/useAuth";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopbarClient() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/client/profile");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="h-16 px-8 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Bienvenue,{" "}
            <span className="text-[#0B1E3A]">{user?.prenom} !</span>
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#0B1E3A] to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.prenom?.[0]}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.prenom} {user?.nom}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user?.role}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  >
                    <User size={16} />
                    Mon profil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition">
                    <Settings size={16} />
                    Paramètres
                  </button>
                </div>

                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
