// src/pages/admin/CatalogHotel.tsx
import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Trash2, Tag } from "lucide-react";
import type { CatalogHotelProps, CatalogItem } from "../../interfaces/admin.interface";

export default function CatalogManager({ type, title }: CatalogHotelProps) {
  // L'état est typé comme un tableau de CatalogItem
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<{ nom: string; icone: string }>({ nom: "", icone: "" });

  useEffect(() => {
    // Définition de la fonction de récupération à l'intérieur pour éviter l'erreur de dépendance ESLint
    const fetchItems = async (): Promise<void> => {
      try {
        setLoading(true);
        // On effectue l'appel API
        const response = await api.get<CatalogItem[]>(`/admin/catalog/${type}`);
        
        // On met à jour l'état seulement si la requête réussit
        setItems(response.data);
      } catch (error) {
        // En cas d'erreur (ex: 401), on log l'erreur proprement
        console.error(error);
        // On s'assure que items reste un tableau vide pour que le .map() ne crash pas
        setItems([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post(`/admin/catalog/${type}`, form);
      setForm({ nom: "", icone: "" });
      // On recharge les données normalement après un ajout réussi
      const response = await api.get<CatalogItem[]>(`/admin/catalog/${type}`);
      setItems(response.data);
    } catch (error) {
        console.error(`Erreur lors de l'ajout d'un ${type.slice(0, -1)}:`, error);
      alert("Impossible d'ajouter l'élément. Vérifiez vos droits d'accès.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-[#0B1E3A]">{title}</h1>
      </header>

      {/* Section Formulaire */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Nom</label>
            <input
              type="text"
              className="w-full border-gray-200 border p-2.5 rounded-xl outline-none focus:border-yellow-500"
              value={form.nom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="bg-[#0B1E3A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition">
            Ajouter
          </button>
        </form>
      </div>

      {/* Affichage des données */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Chargement du catalogue...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ici, items est garanti d'être un tableau (soit rempli, soit vide via le catch) */}
          {items.length > 0 ? (
            items.map((item) => (
              <div 
                key={item.idEquipement || item.idService} 
                className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Tag size={20} className="text-slate-500" />
                  </div>
                  <span className="font-bold text-[#0B1E3A]">{item.nom}</span>
                </div>
                <button className="text-gray-300 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 italic text-sm">Aucun élément disponible dans le catalogue.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}