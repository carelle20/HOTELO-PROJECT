import { type Reservation } from "../../interfaces/client.interface";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { clientService } from "../../services/client.service";

interface ReservationCardProps {
  reservation: Reservation;
  onCancelled?: () => void;
}

export default function ReservationCard({
  reservation,
  onCancelled,
}: ReservationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await clientService.cancelReservation(
        reservation.idReservation
      );
      if (result.success) {
        toast.success("Réservation annulée avec succès");
        onCancelled?.();
      }
    } catch (error) {
        console.error(error);
      toast.error("Erreur lors de l'annulation de la réservation");
    } finally {
      setIsLoading(false);
      setShowCancelConfirm(false);
    }
  };

  const canCancel =
    reservation.statut === "confirmée" &&
    new Date(reservation.dateArrivee) > new Date();

  const statusColors = {
    confirmée: "bg-green-100 text-green-700",
    annulée: "bg-red-100 text-red-700",
    en_cours: "bg-blue-100 text-blue-700",
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0B1E3A]">
              {reservation.hotelDetails?.nom || "Hôtel inconnu"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin size={16} />
              <span>
                {reservation.hotelDetails?.ville},{" "}
                {reservation.hotelDetails?.pays}
              </span>
            </div>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[
                reservation.statut as keyof typeof statusColors
              ]
            }`}
          >
            {reservation.statut.charAt(0).toUpperCase() +
              reservation.statut.slice(1)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-[#0B1E3A]" />
            <div>
              <p className="text-gray-600">Arrivée</p>
              <p className="font-semibold text-gray-800">
                {formatDate(reservation.dateArrivee)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-[#0B1E3A]" />
            <div>
              <p className="text-gray-600">Départ</p>
              <p className="font-semibold text-gray-800">
                {formatDate(reservation.dateDepart)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-[#0B1E3A]" />
            <div>
              <p className="text-gray-600">Durée</p>
              <p className="font-semibold text-gray-800">
                {reservation.nombreNuits} nuit(s)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <DollarSign size={16} className="text-yellow-500" />
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-semibold text-[#0B1E3A]">
                {reservation.montantTotal}€
              </p>
            </div>
          </div>
        </div>

        {/* Room Info */}
        {reservation.chambreDetails && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-1">Chambre</p>
            <p className="font-semibold text-gray-800">
              {reservation.chambreDetails.nom} - {reservation.chambreDetails.capacite} pers.
            </p>
          </div>
        )}

        {/* Actions */}
        {canCancel && (
          <div className="pt-4 border-t border-gray-200">
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
              >
                <Trash2 size={16} />
                Annuler la réservation
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Êtes-vous sûr ? Cette action est irréversible.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                  >
                    Non
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm disabled:opacity-50"
                  >
                    {isLoading ? "Annulation..." : "Oui, annuler"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
