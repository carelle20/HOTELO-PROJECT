import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Room3DViewProps {
  roomId?: string;
  roomName: string;
  hotelId?: number;
  hotelName: string;
}

export default function Room3DView({ roomName, hotelName }: Room3DViewProps) {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  // Images placeholder - dans un cas réel, ce seraient les images de la chambre depuis l'API
  const roomImages = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1540932239986-310128078ceb?auto=format&fit=crop&q=80&w=1200",
  ];

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
          >
            <ArrowLeft size={24} /> Retour
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{roomName}</h1>
            <p className="text-slate-400 text-sm">{hotelName}</p>
          </div>
        </div>
        <div className="text-slate-400 text-sm">
          {imageIndex + 1} / {roomImages.length}
        </div>
      </div>

      {/* Image Principale */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
          <motion.img
            key={imageIndex}
            src={roomImages[imageIndex]}
            alt={`Chambre ${roomName} - Image ${imageIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
          />

          {/* Contrôles Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Galerie Miniatures en bas */}
      <div className="bg-slate-900 border-t border-slate-700 px-4 py-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {roomImages.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setImageIndex(idx)}
              whileHover={{ scale: 1.05 }}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                idx === imageIndex
                  ? "border-yellow-400 shadow-lg shadow-yellow-400"
                  : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <img
                src={img}
                alt={`Vignette ${idx + 1}`}
                className="w-24 h-24 object-cover"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-950 border-t border-slate-700 px-6 py-4">
        <p className="text-slate-300 text-sm">
          Explorez la chambre en détail avant de réserver
        </p>
      </div>
    </div>
  );
}
