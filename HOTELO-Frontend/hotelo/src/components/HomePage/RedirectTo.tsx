import { motion } from "framer-motion";
import { Hotel, ArrowRight, SquareArrowRight, BedDouble, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import hotelImage from "/assets/vue-hotel.jpg"; 

export default function RedirectTo() {
  return (
    <section className="relative py-20 overflow-hidden bg-cover bg-center" 
      style={{ backgroundImage: "url('/assets/terasse-hotel.jpg')" }}>

      <div className="absolute inset-0 bg-[#0B1E3A]/40 backdrop-blur[2px]" />

      <div className="relative max-w-7xl mx-auto px-6 ">
        <div className="grid gap-16 md:grid-cols-2 items-center">

          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            {/* Icône */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-[#F4B400] text-[#0B1E3A]"
            >
                <SquareArrowRight size={16} className="inline-block mr-2" />
              Pret à commencer ?
            </motion.span>

            <h2 className="text-3xl md:text-3xl font-bold text-white mb-6">
              Simplifiez la gestion de vos 
              <span className="text-yellow-500"> réservations et vos hôtels</span> 
            </h2>

            <p className="text-white text-lg mb-10">
              Rejoignez une plateforme moderne qui connecte voyageurs et
              responsables d’hôtels en toute simplicité.
            </p>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 text-slate-900 px-6 py-3 font-semibold hover:bg-yellow-300 transition"
              >
                Découvrir les hôtels
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/connexion"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold rounded-lg border border-gray-200 text-slate-900 bg-white hover:bg-gray-200 hover:text-[#0B1E3A] transition"
              >
                Enregistrer votre hôtel
                <Hotel size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Illustration : Carte d'hôtel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="relative flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
                {/* Image hôtel */}
                <div className="relative h-44 overflow-hidden">
                    <img
                        src={hotelImage}
                        alt="Hôtel moderne"
                        className="h-full w-full object-cover"
                    />
                    {/* Badge note */}
                    <div className="absolute top-3 right-3 bg-yellow-400 text-slate-900 text-sm font-bold px-3 py-1 rounded-full shadow">
                        ★ 4.6
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-4">
                    <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        Hôtel La Perle d’Or
                    </h3>
                    <p className="text-sm text-slate-600">
                        Douala, Cameroun
                    </p>
                    </div>

                    {/* Infos */}
                    <div className="flex justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <BedDouble size={16} />
                        25 chambres
                      </span>
                      <span className="flex items-center gap-1">
                        <Wifi size={16} />
                        Wifi
                      </span>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center justify-between pt-2">
                    <div>
                        <span className="text-lg font-bold text-slate-900">
                        45 000 FCFA
                        </span>
                        <span className="text-sm text-slate-500">
                        {" "} / nuit
                        </span>
                    </div>

                    <button 
                      className="text-sm font-semibold text-yellow-400 bg-[#0B1E3A] px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                        Voir détails
                    </button>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
