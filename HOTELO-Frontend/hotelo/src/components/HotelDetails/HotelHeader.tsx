import { Star, MapPin } from "lucide-react";

interface Hotel {
  nom: string;
  ville?: string;
  pays?: string;
  adresse?: string;
  prixMin?: number;
  prixMax?: number;
}

interface HotelHeaderProps {
  hotel: Hotel;
}

export default function HotelHeader({ hotel }: HotelHeaderProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100 h-fit sticky top-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{hotel.nom}</h1>
        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <MapPin size={18} />
          <span>{hotel.adresse || hotel.ville}, {hotel.pays}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star size={20} className="text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-slate-900">4.5</span>
          <span className="text-slate-600">(128 avis)</span>
        </div>
      </div>

      {/* Prix */}
      <div className="border-t border-slate-200 pt-6 mb-6">
        <p className="text-slate-600 text-sm mb-2">À partir de</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-slate-900">{hotel.prixMin?.toLocaleString()}</span>
          <span className="text-slate-600">FCFA / nuit</span>
        </div>
        {hotel.prixMax && (
          <p className="text-sm text-slate-600 mt-2">jusqu'à {hotel.prixMax?.toLocaleString()} FCFA</p>
        )}
      </div>

      {/* Boutons */}
      <button className="w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition mb-3">
        Réserver maintenant
      </button>
      <button className="w-full border border-slate-300 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-50 transition">
        Ajouter aux favoris
      </button>
    </div>
  );
}
