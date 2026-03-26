import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useSearchHotels } from "../../hooks";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const { hotels, loading, error, search } = useSearchHotels();
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowResults(true);
      await search(searchInput);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (!value.trim()) {
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <MapPin size={20} className="ml-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={searchInput}
            onChange={handleInputChange}
            className="flex-1 px-4 py-4 outline-none text-slate-700 placeholder-slate-400"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-300 transition flex items-center gap-2"
          >
            <Search size={20} />
            Rechercher
          </button>
        </div>
      </form>

      {/* Résultats de recherche */}
      <AnimatePresence>
        {showResults && searchInput.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-y-auto"
          >
            {error && (
              <div className="p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="p-8 text-center text-slate-500">
                Recherche en cours...
              </div>
            )}

            {!loading && hotels.length === 0 && !error && (
              <div className="p-8 text-center text-slate-500">
                Aucun hôtel trouvé pour "{searchInput}"
              </div>
            )}

            {!loading && hotels.length > 0 && (
              <div className="divide-y">
                {hotels.map((hotel) => (
                  <Link
                    key={hotel.idHotel}
                    to={`/hotels-details/${hotel.idHotel}`}
                    onClick={() => setShowResults(false)}
                    className="p-4 hover:bg-slate-50 transition flex items-center gap-4 group"
                  >
                    {/* Image thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                      {hotel.images && hotel.images.length > 0 && (
                        <img
                          src={hotel.images[0].url}
                          alt={hotel.nom}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">
                        {hotel.nom}
                      </h4>
                      <p className="text-sm text-slate-600 truncate">
                        <MapPin size={14} className="inline-block mr-1" />
                        {hotel.ville}, {hotel.pays}
                      </p>
                      <p className="text-sm font-semibold text-yellow-600">
                        À partir de {hotel.prixMin} FCFA
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
