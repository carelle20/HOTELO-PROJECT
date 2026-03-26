import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { useState, useMemo } from "react";
import HotelCard from "../components/DiscoverHotels/HotelCard";
import HotelCardSkeleton from "../components/DiscoverHotels/HotelCardSkeleton";
import { useHotels } from "../hooks";

export default function DiscoverHotels() {
  const { hotels, loading, error } = useHotels();
  
  // États pour les filtres
  const [countryTerm, setCountryTerm] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [cityTerm, setCityTerm] = useState(""); 
  const [quatarterTerm, setQuarterTerm] = useState(""); 
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesCountry = (hotel.pays || "").toLowerCase().includes(countryTerm.toLowerCase());
      const matchesName = (hotel.nom || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = (hotel.ville || "").toLowerCase().includes(cityTerm.toLowerCase());
      const matchesQuarter = (hotel.adresse || "").toLowerCase().includes(quatarterTerm.toLowerCase());

      const priceMin = hotel.prixMin || 0;
      const priceMax = hotel.prixMax || priceMin;
      const userMin = minPrice === "" ? 0 : Number(minPrice);
      const userMax = maxPrice === "" ? Infinity : Number(maxPrice);

      const matchesPrice = priceMin <= userMax && priceMax >= userMin;

      return matchesCountry && matchesName && matchesCity && matchesQuarter && matchesPrice;
    });
  }, [hotels, countryTerm, searchTerm, cityTerm, quatarterTerm, minPrice, maxPrice]);

  const clearFilters = () => {
    setCountryTerm(""); setSearchTerm(""); setCityTerm("");
    setQuarterTerm(""); setMinPrice(""); setMaxPrice("");
  };

  return (
    <section className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Découvrez nos différents hôtels</h1>
          <p className="text-lg text-slate-600">Trouvez l'endroit idéal pour votre prochain séjour.</p>
        </motion.div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* BARRE DE FILTRES */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-16 border border-slate-100">
           <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pays</label>
                <input
                  type="text"
                  placeholder="Ex: Cameroun"
                  value={countryTerm}
                  onChange={(e) => setCountryTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'hôtel</label>
                <input
                  type="text"
                  placeholder="Ex: La Perle"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                <input
                  type="text"
                  placeholder="Ex: Douala"
                  value={cityTerm}
                  onChange={(e) => setCityTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quartier</label>
                <input
                  type="text"
                  placeholder="Ex: Bonamoussadi"
                  value={quatarterTerm}
                  onChange={(e) => setQuarterTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix min</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix max</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                onClick={clearFilters}
                className="w-full px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
              >
                <Filter size={18} className="inline-block mr-2" />
                Réinitialiser
              </button>
           </div>
           <div className="mt-4 text-sm text-slate-600">
             {filteredHotels.length} hôtel(s) trouvé(s)
           </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <HotelCardSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <motion.div key={hotel.idHotel} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <HotelCard 
                        id={hotel.idHotel}
                        nom={hotel.nom}
                        pays={hotel.pays}
                        ville={hotel.ville}
                        adresse={hotel.adresse}
                        prixMin={hotel.prixMin}
                        note={4.5}
                        chambres={hotel.nombreChambres}
                        // Adaptation : On transforme le tableau d'objets images en tableau de strings (URLs)
                        images={hotel.images?.map((img) => img.url) || []}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500">Aucun hôtel ne correspond à vos critères.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}