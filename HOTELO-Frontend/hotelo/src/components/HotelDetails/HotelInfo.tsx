import { MapPin, Star } from "lucide-react";

interface HotelInfoProps {
  nom: string;
  ville: string;
  description: string;
  note: number;
  prixMin: number;
}

export default function HotelInfo({
  nom,
  ville,
  description,
  note,
  prixMin,
}: HotelInfoProps) {
  return (
    <div className="space-y-6">
      {/* Titre + note */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{nom}</h1>

        <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-yellow-500" />
            {ville}
          </span>

          <span className="flex items-center gap-1 font-semibold">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            {note}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-700 leading-relaxed">{description}</p>

      {/* Prix */}
      <div className="pt-4 border-t">
        <span className="text-sm text-slate-500">À partir de</span>
        <div className="text-2xl font-bold text-slate-900">
          {prixMin.toLocaleString()} FCFA
          <span className="text-sm font-medium text-slate-500"> / nuit</span>
        </div>
      </div>
    </div>
  );
}
