import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

import HotelCard from "../components/DiscoverHotels/HotelCard";
import HotelCardSkeleton from "../components/DiscoverHotels/HotelCardSkeleton";
import { hotels } from "../data/hotels.mock";

export default function DiscoverHotels() {
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [countryTerm, setCountryTerm] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); // Nom de l'hôtel
  const [cityTerm, setCityTerm] = useState(""); // Ville
  const [quatarterTerm, setQuarterTerm] = useState(""); // Quartier
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Logique de filtrage dynamique mise à jour
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // 1. Recherche par Pays
      const matchesCountry = hotel.pays.toLowerCase().includes(countryTerm.toLowerCase());
      // 2. Recherche par Nom
      const matchesName = hotel.nom.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 3. Recherche par Ville 
      const matchesCity = hotel.ville.toLowerCase().includes(cityTerm.toLowerCase());

      // 4. Recherche par Quartier
      const matchesQuarter = hotel.quartier.toLowerCase().includes(quatarterTerm.toLowerCase());

      // 5. Logique de prix intelligente :
      // On vérifie si la fourchette de l'hôtel intersecte la recherche de l'utilisateur
      const priceMin = hotel.prixMin || 0;
      const priceMax = hotel.prixMax || priceMin; // Si pas de prixMax, on prend prixMin

      const userMin = minPrice === "" ? 0 : Number(minPrice);
      const userMax = maxPrice === "" ? Infinity : Number(maxPrice);

      // On affiche l'hôtel si son prix minimum est dans la plage demandée
      // OU si son prix maximum est dans la plage demandée
      const matchesPrice = priceMin <= userMax && priceMax >= userMin;

      return matchesCountry && matchesName && matchesCity && matchesQuarter && matchesPrice;
    });
  }, [countryTerm, searchTerm, cityTerm, quatarterTerm, minPrice, maxPrice]);

  const clearFilters = () => {
    setCountryTerm("");
    setSearchTerm("");
    setCityTerm("");
    setQuarterTerm("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <section className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-3xl md:text-3xl font-bold text-slate-900 mb-4">
            Découvrez nos differents hotels
          </h1>
          <p className="text-lg text-slate-600">
            Saisissez vos critères pour une recherche personnalisée.
          </p>
        </motion.div>

        {/* BARRE DE FILTRES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-16 border border-slate-100 w-full"
        >
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 items-end">

            {/* Recherche par pays */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Pays</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Cameroun..."
                  value={countryTerm}
                  onChange={(e) => setCountryTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-4 pr-10 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
                />
              </div>
            </div>
            
            {/* Recherche par Nom */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Nom de l'hôtel</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Hilton..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-4 pr-10 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
                />
              </div>
            </div>

            {/* Recherche par Ville */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Ville</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Douala..."
                  value={cityTerm}
                  onChange={(e) => setCityTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
                />
              </div>
            </div>

            {/* Recherche par Quartier */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Quartier</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Akwa, Bastos..."
                  value={quatarterTerm}
                  onChange={(e) => setQuarterTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
                />
              </div>
            </div>

            {/* Prix Min recherché */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Prix Minimum (FCFA)</label>
              <input
                type="number"
                placeholder="Ex: 30000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
              />
            </div>

            {/* Prix Max recherché */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Prix Maximum (FCFA)</label>
              <input
                type="number"
                placeholder="Ex: 80000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
              />
            </div>

            {/* Bouton de résultats */}
            <div className="flex flex-col gap-2">
              <button onClick={clearFilters} className="text-[9px] text-right text-slate-400 hover:text-red-500 transition font-bold uppercase mr-1">
                Tout effacer
              </button>
              <div className="flex items-center justify-center gap-2 rounded-xl bg-[#0B1E3A] text-yellow-400 font-bold py-3 shadow-lg h-[46px] w-full border border-slate-800">
                <Search size={16} />
                <span className="text-xs">{filteredHotels.length} Trouvés</span>
              </div>
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
                  <motion.div 
                    key={hotel.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <HotelCard {...hotel} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                    <Filter size={32} />
                  </div>
                  <p className="text-slate-500 italic">Aucun hôtel ne correspond à votre recherche à cette adresse ou ce budget.</p>
                  <button onClick={clearFilters} className="mt-4 text-yellow-600 font-bold hover:underline">
                    Réinitialiser les filtres
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