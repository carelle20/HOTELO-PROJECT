import { type Chambre } from "../../interfaces/client.interface";
import { Users, DollarSign } from "lucide-react";

interface RoomCardProps {
  chambre: Chambre;
  onReserveClick: (chambreId: number) => void;
  isLoading?: boolean;
}

export default function RoomCard({
  chambre,
  onReserveClick,
  isLoading = false,
}: RoomCardProps) {
  const isAvailable = chambre.statut === "disponible";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {chambre.images && chambre.images.length > 0 ? (
          <img
            src={chambre.images[0].url}
            alt={chambre.nom}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Non disponible</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#0B1E3A] mb-2">{chambre.nom}</h3>

        {chambre.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {chambre.description}
          </p>
        )}

        {/* Room Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-[#0B1E3A]" />
            <span>{chambre.capacite} personnes</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-yellow-500" />
            <span className="font-semibold text-[#0B1E3A]">
              {chambre.prix}€ / nuit
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isAvailable ? "Disponible" : "Non disponible"}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onReserveClick(chambre.idChambre)}
          disabled={!isAvailable || isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            isAvailable
              ? "bg-[#0B1E3A] text-white hover:bg-[#0B1E3A]/90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Chargement..." : "Réserver"}
        </button>
      </div>
    </div>
  );
}
