import { motion } from "framer-motion";
import {
  Layout,
  CalendarCheck,
  ShieldCheck,
  View,
  MapPin,
  BarChart3,
  KeyRound,
} from "lucide-react";

const features = [
  {
    title: "Presentation detaillée et centralisée",
    description:
      "Chaque hôtel dispose d'un espace propre pour publier ses tarifs, sa localisation précise et l'ensemble des activités proposées.",
    icon: Layout,
  },
  {
    title: "Disponibilités en temps réel",
    description:
      "Consultez instantanément les chambres disponibles avant toute reservation.",
    icon: CalendarCheck,
  },
  {
    title: "Réservation sécurisée",
    description:
      "Réservez votre séjour depuis chez vous via un processus simple et sécurisé.",
    icon: ShieldCheck,
  },
  {
    title: "Visionnage 3D",
    description:
      "visualisez concrètement chaque chambre pour une meilleure appréciation avant de faire un choix.",
    icon: View,
  },
  {
    title: "Géolocalisation précise",
    description:
      "Trouvez rapidement les hôtels en fonction de votre emplacement exact pour eviter des depenses inutiles.",
    icon: MapPin,
  },
  {
    title: "Statistiques & suivi",
    description:
      "Analysez les performances, les avis et les réservations en temps réel.",
    icon: BarChart3,
  },
];

const duplicatedFeatures = [...features, ...features];

export default function KeyFeatures() {
  return (
    <section className="bg-gray-100 py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Icône centrale */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: false }}
          className="flex justify-center mb-6"
        >

          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F4B400] text-[#0B1E3A]">
             <KeyRound size={32} />
          </div>
        </motion.div>

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center max-w-3xl mx-auto mb-20"
        >

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Fonctionnalités clés
          </h2>
          <p className="text-lg text-gray-700">
            Une plateforme moderne et innovante pour la gestion et la
            réservation hôtelière.
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 15,
              ease: "linear",
            }}
          >
            {duplicatedFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative min-w-[300px] max-w-[300px] bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-md"
                >
                  {/* Glow animé */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-100/40 via-transparent to-transparent blur-xl opacity-70 animate-pulse" />

                  {/* Contenu */}
                  <div className="relative z-10">
                    {/* Icône */}
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-yellow-400 text-slate-900"
                    >
                      <Icon size={26} />
                    </motion.div>

                      <motion.h3
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                            {feature.title}
                        </h3>
                      </motion.h3>
                    

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Fade sur les côtés */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
        </div>

      </div>
    </section>
  );
}
