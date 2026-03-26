import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useHomepageHotels } from "../../hooks";
import HotelCard from "../DiscoverHotels/HotelCard";
import HotelCardSkeleton from "../DiscoverHotels/HotelCardSkeleton";

export default function FeaturedHotels() {
  const { hotels, loading, error } = useHomepageHotels();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Hôtels en Vedette
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Découvrez nos établissements les plus populaires pour votre prochain séjour
          </p>
        </motion.div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* Grille des hôtels */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Skeletons de chargement
            Array.from({ length: 6 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))
          ) : hotels && hotels.length > 0 ? (
            // Affichage des hôtels
            hotels.map((hotel) => (
              <motion.div
                key={hotel.idHotel}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <HotelCard
                  id={hotel.idHotel || 0}
                  nom={hotel.nom}
                  pays={hotel.pays}
                  ville={hotel.ville}
                  adresse={hotel.adresse}
                  prixMin={hotel.prixMin}
                  note={4.5}
                  chambres={hotel.nombreChambres}
                  images={hotel.images?.map((img) => img.url) || []}
                />
              </motion.div>
            ))
          ) : (
            // Pas d'hôtels
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 text-lg">Aucun hôtel disponible pour le moment</p>
            </div>
          )}
        </div>

        {/* Bouton voir plus */}
        {!loading && hotels && hotels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-slate-900 font-semibold rounded-xl hover:bg-yellow-300 transition"
            >
              Voir tous les hôtels
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
