import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

import HotelCard from "../components/DiscoverHotels/HotelCard";
import HotelCardSkeleton from "../components/DiscoverHotels/HotelCardSkeleton";
import { hotels } from "../data/hotels.mock";

export default function DiscoverHotels() {
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxPrice, setMaxPrice] = useState(""); // Vide par défaut pour ne pas limiter au départ

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Logique de filtrage dynamique
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch = 
        hotel.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.ville.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === "" || selectedCity === "Ville" 
        ? true 
        : hotel.ville === selectedCity;

      // Si maxPrice est vide, on ne filtre pas sur le prix
      const matchesPrice = maxPrice === "" || (hotel.prix && hotel.prix <= Number(maxPrice));

      return matchesSearch && matchesCity && matchesPrice;
    });
  }, [searchTerm, selectedCity, maxPrice]);

  return (
    <section className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Découvrez nos differents hotels
          </h1>
          <p className="text-lg text-slate-600">
            Saisissez vos critères pour une recherche personnalisée.
          </p>
        </motion.div>

        {/* BARRE DE FILTRES AVEC SAISIE DE PRIX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-16 border border-slate-100"
        >
          <div className="grid gap-4 md:grid-cols-4 items-end">
            
            {/* Recherche Nom/Ville */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Hôtel ou Ville</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Hilton, Douala..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                {searchTerm && (
                   <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" onClick={() => setSearchTerm("")} />
                )}
              </div>
            </div>

            {/* Ville Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Destination</label>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition bg-white"
              >
                <option value="">Toutes les villes</option>
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Kribi">Kribi</option>
              </select>
            </div>

            {/* Saisie du Prix Max */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Prix Max (FCFA)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ex: 50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">FCFA</span>
              </div>
            </div>

            {/* Bouton de comptage */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#0B1E3A] text-yellow-400 font-bold px-4 py-3 shadow-lg h-[50px]">
              <Search size={18} />
              {filteredHotels.length} Résultats
            </div>
          </div>
        </motion.div>

        {/* LISTE DES HÔTELS */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <HotelCardSkeleton key={index} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <motion.div key={hotel.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <HotelCard {...hotel} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500">Aucun résultat pour ces critères.</p>
                  <button 
                    onClick={() => { setSearchTerm(""); setSelectedCity(""); setMaxPrice(""); }}
                    className="mt-4 text-yellow-600 font-bold"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}