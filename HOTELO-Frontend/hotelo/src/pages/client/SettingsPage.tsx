// src/pages/client/SettingsPage.tsx
import { useState } from "react";
import { Lock, Bell, Eye, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingUpdates: true,
    newsAndOffers: false,
    privateProfile: false,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Préférences mises à jour");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0B1E3A] mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={20} className="text-[#0B1E3A]" />
          <h2 className="text-xl font-bold text-[#0B1E3A]">
            Notifications
          </h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">
                Notifications par email
              </p>
              <p className="text-sm text-gray-600">
                Recevez des notifications importantes par email
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleSettingChange("emailNotifications")}
              className="w-5 h-5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">
                Notifications par SMS
              </p>
              <p className="text-sm text-gray-600">
                Recevez des alertes urgentes par SMS
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={() => handleSettingChange("smsNotifications")}
              className="w-5 h-5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">
                Mises à jour des réservations
              </p>
              <p className="text-sm text-gray-600">
                Soyez informé des changements concernant vos réservations
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.bookingUpdates}
              onChange={() => handleSettingChange("bookingUpdates")}
              className="w-5 h-5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">
                Actualités et offres
              </p>
              <p className="text-sm text-gray-600">
                Recevez nos dernières offres et actualités
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.newsAndOffers}
              onChange={() => handleSettingChange("newsAndOffers")}
              className="w-5 h-5 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye size={20} className="text-[#0B1E3A]" />
          <h2 className="text-xl font-bold text-[#0B1E3A]">
            Confidentialité
          </h2>
        </div>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-medium text-gray-800">Profil privé</p>
            <p className="text-sm text-gray-600">
              Masquez votre profil des autres utilisateurs
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.privateProfile}
            onChange={() => handleSettingChange("privateProfile")}
            className="w-5 h-5 cursor-pointer"
          />
        </label>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock size={20} className="text-[#0B1E3A]" />
          <h2 className="text-xl font-bold text-[#0B1E3A]">Sécurité</h2>
        </div>

        <div className="space-y-3">
          <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left font-medium text-gray-800">
            Modifier le mot de passe
          </button>
          <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left font-medium text-gray-800">
            Authentification à deux facteurs
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          Zone de danger
        </h2>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
