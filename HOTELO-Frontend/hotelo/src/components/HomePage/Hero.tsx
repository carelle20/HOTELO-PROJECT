import { motion } from "framer-motion";
import { Link } from "react-router-dom";


export default function Hero() {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: "url('public/assets/chambre-Accueil.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0" />

      {/* Contenu */}
      <div className="relative z-10 flex h-full items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl text-center lg:text-left"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-[#F4B400] text-[#0B1E3A]"
            >
              Recherche & réservation d’hôtels
            </motion.span>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Trouvez et réservez
              <span className="text-[#F4B400]"> dans l’hôtel idéal</span>
              <br />
              en toute simplicité
            </motion.h1>
            

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="mt-6 text-lg text-white"
            >
              HOTELO vous permet d'enregistrer vos hotels, de découvrir, comparer et réserver les meilleures chambres
              d'hôtels en quelques clics. Une plateforme moderne, rapide et
              sécurisée, pensée pour tous vos séjours.
            </motion.p>

            {/* Boutons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.01 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-lg bg-[#F4B400] text-[#0B1E3A] hover:bg-yellow-400 transition shadow-lg"
              >
                Créer un compte
              </Link>

              <Link
                to="/discover"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-lg border border-gray-200 text-slate-900 bg-white hover:bg-gray-200 hover:text-[#0B1E3A] transition"
              >
                Explorer les hôtels
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
