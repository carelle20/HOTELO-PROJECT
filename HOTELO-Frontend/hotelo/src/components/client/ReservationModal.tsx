import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useReservation } from "../../hooks/useReservation";
import { type Chambre } from "../../interfaces/client.interface";
import { X, Calendar, Users, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ReservationModalProps {
  chambre: Chambre;
  hotelId: number;
  hotelNom: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({
  chambre,
  hotelId,
  hotelNom,
  isOpen,
  onClose,
}: ReservationModalProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isCreating, createReservation } = useReservation();

  const [dateArrivee, setDateArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [nombrePersonnes, setNombrePersonnes] = useState(1);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setDateArrivee("");
    setDateDepart("");
    setNombrePersonnes(1);
    setError(null);
    onClose();
  };

  const calculateNights = () => {
    if (!dateArrivee || !dateDepart) return 0;
    const arrival = new Date(dateArrivee);
    const departure = new Date(dateDepart);
    return Math.ceil(
      (departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();
  const totalPrice = nights * chambre.prix;

  const handleReservation = async () => {
    // Validation
    if (!dateArrivee || !dateDepart) {
      setError("Veuillez sélectionner les dates d'arrivée et de départ");
      return;
    }

    if (nombrePersonnes < 1 || nombrePersonnes > chambre.capacite) {
      setError(
        `Veuillez sélectionner un nombre valide de personnes (1-${chambre.capacite})`
      );
      return;
    }

    if (new Date(dateDepart) <= new Date(dateArrivee)) {
      setError("La date de départ doit être après la date d'arrivée");
      return;
    }

    if (nights < 1) {
      setError("La durée du séjour doit être au moins 1 nuit");
      return;
    }

    try {
      const result = await createReservation({
        chambreId: chambre.idChambre,
        hotelId,
        dateArrivee,
        dateDepart,
        nombreNuits: nights,
        montantTotal: totalPrice,
        nombrePersonnes,
      });

      if (result.success) {
        toast.success("Réservation créée avec succès !");
        handleClose();
        // Rediriger vers les réservations
        setTimeout(() => {
          navigate("/client/reservations");
        }, 1500);
      }
    } catch (err) {
        console.error(err);
      setError("Erreur lors de la création de la réservation");
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  // Si non authentifié, afficher message de connexion
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg max-w-md w-full z-50">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>

          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold text-[#0B1E3A] mb-2">
              Connexion requise
            </h3>

            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour effectuer une réservation.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleClose();
                  navigate("/connexion");
                }}
                className="w-full px-6 py-3 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium"
              >
                Se connecter
              </button>

              <button
                onClick={() => {
                  handleClose();
                  navigate("/inscription");
                }}
                className="w-full px-6 py-3 border border-[#0B1E3A] text-[#0B1E3A] rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1E3A]">
              Réservation - {chambre.nom}
            </h2>
            <p className="text-gray-600">{hotelNom}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Room Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Chambre sélectionnée</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{chambre.nom}</p>
                <p className="text-sm text-gray-600">
                  Capacité: {chambre.capacite} personnes
                </p>
              </div>
              <p className="text-xl font-bold text-yellow-500">
                {chambre.prix}€ / nuit
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date d'arrivée
                </label>
                <input
                  type="date"
                  value={dateArrivee}
                  onChange={(e) => {
                    setDateArrivee(e.target.value);
                    setError(null);
                  }}
                  min={minDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date de départ
                </label>
                <input
                  type="date"
                  value={dateDepart}
                  onChange={(e) => {
                    setDateDepart(e.target.value);
                    setError(null);
                  }}
                  min={dateArrivee || minDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-2" />
                Nombre de personnes
              </label>
              <select
                value={nombrePersonnes}
                onChange={(e) => {
                  setNombrePersonnes(parseInt(e.target.value));
                  setError(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
              >
                {Array.from({ length: chambre.capacite }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n} personne{n > 1 ? "s" : ""}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Summary */}
          {nights > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Durée du séjour:</span>
                <span className="font-medium text-gray-800">
                  {nights} nuit{nights > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Prix par nuit:</span>
                <span className="font-medium text-gray-800">{chambre.prix}€</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-yellow-500">{totalPrice}€</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleReservation}
            disabled={isCreating || !dateArrivee || !dateDepart}
            className="flex-1 px-6 py-3 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <DollarSign size={18} />
            {isCreating ? "Réservation..." : "Réserver"}
          </button>
        </div>
      </div>
    </div>
  );
}
