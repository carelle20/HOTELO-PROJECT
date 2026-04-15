import React, { useEffect, useState } from 'react';
import api from '../../../api/axios'; 
import HotelCard from '../../../components/hotel-manager/HotelCard';
import { Search, Filter } from 'lucide-react';

interface HotelData {
  idHotel: number;
  nom: string;
  ville: string;
  adresse: string;
  description: string;
  statut: string;
  prixMin: number;
  prixMax: number;
  _count: { chambres: number };
  images: { url: string; estPrincipale: boolean }[];
}

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get<HotelData[]>('/manager/hotels');
        setHotels(res.data);
      } catch (err) {
        console.error("Erreur récupération hôtels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(h => 
    h.nom.toLowerCase().includes(search.toLowerCase()) || 
    h.ville.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mes Établissements</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Vous gérez actuellement <span className="text-indigo-600 font-bold">{hotels.length}</span> hôtel(s)
          </p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/manager/hotels/create'}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          + Ajouter un hôtel
        </button>
      </div>

      {/* FILTRES & RECHERCHE */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou ville..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#0B1E3A]/10 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-slate-600 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <Filter size={18} />
          Filtres
        </button>
      </div>

      {/* Grille des cartes */}
      {filteredHotels.length > 0 ? (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 py-8 ">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.idHotel} hotel={hotel} />
          ))}
        </div>
      ) : (
        /* État vide */
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
          <div className="text-5xl mb-4 text-gray-200"></div>
          <h3 className="text-xl font-bold text-gray-800">Aucun hôtel enregistré</h3>
        </div>
      )}
    </div>
  );
};

export default HotelList;