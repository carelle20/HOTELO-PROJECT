import { motion } from "framer-motion";
import React from "react";
import {
  Wifi,
  Car,
  Snowflake,
  ShieldCheck,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  GlassWater,
  Presentation,
  Palmtree,
  Sparkles,
} from "lucide-react";

interface IconProps {
  size?: number | string;
}

/* Déclaré AVANT le composant */
const AMENITY_ICONS: Record<string, React.ComponentType<IconProps>> = {
  wifi: Wifi,
  parking: Car,
  climatisation: Snowflake,
  securite: ShieldCheck,
  restaurant: UtensilsCrossed,
  piscine: Waves,
  "salle de sport": Dumbbell,
  bar: GlassWater,
  "salle de conférence": Presentation,
  "plage privée": Palmtree,
  spa: Sparkles,
};

export default function HotelAmenities({
  amenities,
}: {
  amenities: string[];
}) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-slate-900 mb-10"
        >
          Équipements & Services
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {amenities.map((item, index) => {
            const Icon = AMENITY_ICONS[item];

            /* sécurité absolue */
            if (!Icon) return null;

            return (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }} 
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-2xl shadow border border-slate-100 bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl text-yellow-400">
                  <Icon size={20} />
                </div>

                <span className="font-medium text-slate-800 capitalize">
                  {item}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
