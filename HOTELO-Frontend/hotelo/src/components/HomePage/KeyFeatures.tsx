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
    title: "Présentation détaillée",
    description: "Chaque hôtel dispose d'un espace propre pour publier ses informations et sa localisation précise.",
    icon: Layout,
  },
  {
    title: "Disponibilité temps réel",
    description: "Consultez instantanément les chambres disponibles avant toute réservation.",
    icon: CalendarCheck,
  },
  {
    title: "Réservation sécurisée",
    description: "Réservez votre séjour depuis chez vous via un processus simple et sécurisé.",
    icon: ShieldCheck,
  },
  {
    title: "Visionnage 3D",
    description: "Visualisez concrètement chaque chambre pour une meilleure appréciation.",
    icon: View,
  },
  {
    title: "Géolocalisation précise",
    description: "Trouvez rapidement les hôtels en fonction de votre emplacement exact.",
    icon: MapPin,
  },
  {
    title: "Statistiques & suivi",
    description: "Analysez les performances, les avis et les réservations en temps réel.",
    icon: BarChart3,
  },
];

// On duplique pour l'effet de boucle infinie
const duplicatedFeatures = [...features, ...features];

export default function KeyFeatures() {
  return (
    <section className="bg-slate-100 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Icône centrale */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F4B400] text-[#0B1E3A]">
            <KeyRound size={32} />
          </div>
        </motion.div>

        {/* Titre */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Fonctionnalités clés
          </h2>
          <p className="text-lg text-gray-700">
            Une plateforme moderne pour la gestion hôtelière au Cameroun.
          </p>
        </div>

        {/* Slider */}
        <div className="relative flex overflow-hidden">
          <motion.div
            className="flex gap-6 sm:gap-10 pr-6 sm:pr-10" // Padding pour éviter le chevauchement au reset
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 30, 
              ease: "linear",
            }}
          >
            {duplicatedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="relative min-w-[260px] max-w-[260px] sm:min-w-[320px] sm:max-w-[320px] bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm"
                >
                  
                  <div className="relative z-10">
                    {/* Icône */}
                    <div className="mb-6 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-yellow-400 text-slate-900">
                      <Icon size={24} />
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Fade sur les côtés */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-gray-100 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-gray-100 to-transparent z-20" />
        </div>
      </div>
    </section>
  );
}