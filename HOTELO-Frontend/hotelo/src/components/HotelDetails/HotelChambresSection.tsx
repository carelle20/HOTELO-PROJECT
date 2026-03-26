import { Users, BedDouble, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface Chambre {
  idChambre: number;
  nom: string;
  description?: string;
  capacite: number;
  prix: number;
  statut: string;
  images?: { url: string }[];
}

interface HotelChambresSectionProps {
  chambres: Chambre[];
}

function ChambreCard({ chambre }: { chambre: Chambre }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = chambre.images || [];

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setImageIndex(index);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-6 hover:shadow-md transition">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Galerie Images */}
        <div className="md:col-span-1">
          {/* Image principale */}
          <div className="relative group rounded-2xl overflow-hidden bg-slate-200 h-64 md:h-auto mb-3">
            {images.length > 0 ? (
              <>
                <img
                  src={images[imageIndex].url}
                  alt={chambre.nom}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white"
                    >
                      <ChevronLeft size={20} className="text-slate-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white"
                    >
                      <ChevronRight size={20} className="text-slate-900" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                      {imageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={40} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => goToImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    idx === imageIndex
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Aperçu ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{chambre.nom}</h3>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">{chambre.description || "Chambre spacieuse et confortable"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                chambre.statut === "disponible" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {chambre.statut}
              </span>
            </div>

            <div className="flex items-center gap-6 mt-4 text-slate-700">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-500" />
                <span className="font-medium">{chambre.capacite} pers.</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble size={18} className="text-blue-500" />
                <span className="font-medium">Lit double</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <div>
              <p className="text-slate-600 text-sm mb-1">À partir de</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{chambre.prix.toLocaleString()}</span>
                <span className="text-slate-600 text-sm">FCFA / nuit</span>
              </div>
            </div>
            <button className="bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelChambresSection({ chambres }: HotelChambresSectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Nos Chambres</h2>
      <div className="grid gap-6">
        {chambres.map((chambre) => (
          <ChambreCard key={chambre.idChambre} chambre={chambre} />
        ))}
      </div>
    </section>
  );
}
