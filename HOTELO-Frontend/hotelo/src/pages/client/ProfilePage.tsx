// src/pages/client/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { clientService } from "../../services/client.service";
import { toast } from "sonner";
import { User, Mail, Edit2, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await clientService.updateProfile({
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
      });
      await refreshUser();
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0B1E3A] mb-2">Mon profil</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-[#0B1E3A] to-yellow-500"></div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start justify-between -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0B1E3A] to-yellow-500 rounded-lg border-4 border-white flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {user?.prenom?.[0]}
                  {user?.nom?.[0]}
                </span>
              </div>
              {!isEditing && (
                <div>
                  <h2 className="text-2xl font-bold text-[#0B1E3A]">
                    {user?.prenom} {user?.nom}
                  </h2>
                  <p className="text-gray-600">{user?.role}</p>
                </div>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium"
              >
                <Edit2 size={16} />
                Modifier
              </button>
            )}
          </div>

          {/* Form or Display */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium disabled:opacity-50"
                >
                  <Save size={16} />
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  <X size={16} />
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-[#0B1E3A]" />
                <div>
                  <p className="text-xs text-gray-600 uppercase">Email</p>
                  <p className="font-medium text-gray-800">{user?.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <User size={20} className="text-[#0B1E3A]" />
                <div>
                  <p className="text-xs text-gray-600 uppercase">Rôle</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {user?.role === "client" ? "Client" : user?.role}
                  </p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user?.estValide ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <div>
                  <p className="text-xs text-gray-600 uppercase">Statut</p>
                  <p className="font-medium text-gray-800">
                    {user?.estValide ? "Compte validé" : "En attente de validation"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-[#0B1E3A] mb-2">
          Informations du compte
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            • Compte créé le{" "}
            {new Date(user?.creeLe || "").toLocaleDateString("fr-FR")}
          </li>
          <li>• Vous êtes connecté en tant que client</li>
          <li>• Vous pouvez réserver des chambres dans nos hôtels partenaires</li>
        </ul>
      </div>
    </div>
  );
}
