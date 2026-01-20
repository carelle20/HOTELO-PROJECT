import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  LayoutDashboard,
  BadgeInfo,
  FastForward
} from "lucide-react";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import hotelAnimation from "/assets/Hotel_city.lottie?url";
import MissionAnimation from "/assets/Mission.lottie?url";
import VisionAnimation from "/assets/Vision.lottie?url";

const features = [
  {
    title: "Recherche intelligente",
    description: "Trouvez rapidement des hôtels adaptés à vos besoins grâce à une recherche simple et efficace.",
    icon: Search,
  },
  {
    title: "Fiable",
    description: "Réservez en toute sérénité avec des paiements sécurisés et des avis clients authentifiés.",
    icon: ShieldCheck,
  },
  {
    title: "Rapide",
    description: "De la recherche à la validation, profitez d'une exécution fluide et d'une confirmation instantanée.",
    icon: FastForward,
  },
  {
    title: "Interface moderne",
    description: "Profitez d'une navigation intuitive et d'un design épuré, parfaitement adaptés à tous vos écrans.",
    icon: LayoutDashboard,
  },
];

export default function About() {
  return (
    <section id="about" className="bg-slate-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Icone et titrte */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16 w-full text-center"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F4B400] text-[#0B1E3A] mb-4 shadow-lg">
            <BadgeInfo size={32} />
          </div>
          <h2 className="text-3xl md:text-3xl font-bold text-gray-800">
            À propos de <span className="text-gray-800">HOT<span className="text-[#F4B400]">ELO</span></span>
          </h2>
        </motion.div>

        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* CÔTÉ GAUCHE : Description et Animation */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Description */}
            <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-[#F4B400] pl-6 mb-8 max-w-2xl">
              Une plateforme conçue pour simplifier la réservation dans les hôtels
              tout en offrant aux établissements hôteliers une visibilité professionnelle
              et une gestion optimisée de leurs services.
            </p>
            
            {/* Animation Lottie */}
            <div className="w-full flex justify-center lg:justify-start">
              <DotLottieReact
                src={hotelAnimation}
                loop
                autoplay
                style={{ width: "100%", maxWidth: 500, height: "auto" }}
              />
            </div>
          </motion.div>

          {/* CÔTÉ DROIT */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full max-w-md mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: false }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
                  }}
                  className="group flex items-center bg-white border border-gray-200 rounded-2xl p-6 transition shadow-sm"
                >
                  <div className="mr-6 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[#F4B400] text-[#0B1E3A]">
                    <Icon size={26} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section Mission & Vision */}
        <div className="mt-28 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group bg-white border-2 border-[#2a9d90]/20 rounded-3xl p-8 text-center transition shadow-sm"
          >
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20">
                <DotLottieReact src={MissionAnimation} loop autoplay />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Notre mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Offrir une solution simple, fiable et accessible aux etablissements
              hôteliers et aux voyageurs pour mieux preparer leur sejour. 
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group bg-white border-2 border-[#2a9d90]/20 rounded-3xl p-8 text-center transition shadow-sm"
          >
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20">
                <DotLottieReact src={VisionAnimation} loop autoplay />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Notre vision</h3>
            <p className="text-gray-700 leading-relaxed">
              Simplifier la réservation hôtelière et accroître la visibilité
              des hôtels grâce à une plateforme fluide, moderne et accessible à tous.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}