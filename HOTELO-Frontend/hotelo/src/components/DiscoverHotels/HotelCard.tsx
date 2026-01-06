import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface HotelCardProps {
  id: number;
  nom: string;
  ville: string;
  prix: number;
  note: number;
  chambres: number;
  images: string[];
}

export default function HotelCard({
  id,
  nom,
  ville,
  prix,
  note,
  chambres,
  images,
}: HotelCardProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Fonctions pour changer d'image manuellement
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Évite de cliquer sur la carte
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Défilement automatique
  useEffect(() => {
    if (isHovered) return; // Pause si la souris est dessus

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 secondes pour plus de confort

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 group"
    >
      {/* CAROUSEL */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-200">
        {/* Images avec fondu simple */}
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt={`${nom} - ${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}

        {/* Note (Badge) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold z-10 shadow-sm">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          {note}
        </div>

        {/* Contrôles manuels (visibles au survol) */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={prevImage}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Points indicateurs (Dots) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-yellow-400" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{nom}</h3>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} className="text-yellow-500" />
            {ville}
          </p>
        </div>

        <div className="flex items-center text-sm text-slate-600">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
            <BedDouble size={16} className="text-slate-400" />
            {chambres} chambres
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div>
            <span className="text-xl font-bold text-slate-900">
              {prix.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-medium italic">FCFA / nuit</span>
          </div>

          <button
            onClick={() => navigate(`/hotels/${id}`)}
            className="rounded-xl bg-[#0B1E3A] text-yellow-400 px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition"
          >
            Voir détails
          </button>

        </div>
      </div>
    </motion.article>
  );
}