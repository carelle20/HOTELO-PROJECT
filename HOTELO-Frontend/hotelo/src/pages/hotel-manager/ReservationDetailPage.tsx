import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { type RecentBooking } from "../../interfaces/manager.interface";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { managerService } from "../../services/manager.service";
import { motion } from "framer-motion";

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<RecentBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setIsLoading(true);
        const data = await managerService.getPendingReservations();
        const found = data.find(
          (r) => r.idReservation === Number(id)
        );
        if (!found) {
          toast.error("Réservation non trouvée");
          navigate("/manager/reservations");
          return;
        }
        setReservation(found);
      } catch (error) {
        console.error("Erreur chargement réservation:", error);
        toast.error("Erreur lors du chargement de la réservation");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservation();
  }, [id, navigate]);

  const handleConfirm = async () => {
    if (!reservation) return;
    try {
      setIsProcessing(true);
      await managerService.confirmReservation(reservation.idReservation);
      toast.success("Réservation confirmée! Le client sera notifié.");
      setTimeout(() => navigate("/manager/reservations"), 1500);
    } catch (error) {
      toast.error("Erreur lors de la confirmation");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reservation || !rejectReason.trim()) {
      toast.error("Veuillez entrer un motif de refus");
      return;
    }
    try {
      setIsProcessing(true);
      await managerService.rejectReservation(
        reservation.idReservation,
        rejectReason
      );
      toast.success("Réservation refusée. Le client sera notifié.");
      setTimeout(() => navigate("/manager/reservations"), 1500);
    } catch (error) {
      toast.error("Erreur lors du refus");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Chargement...</p>
        </div>
      </motion.div>
    );
  }

  if (!reservation) {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/manager/reservations"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8"
          >
            <ArrowLeft size={20} />
            Retour
          </Link>
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">
              Réservation non trouvée
            </h2>
          </div>
        </div>
      </motion.div>
    );
  }

  const nights = Math.ceil(
    (new Date(reservation.dateDepart).getTime() -
      new Date(reservation.dateArrivee).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const isConfirmed = reservation.statut === "confirmée";

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <motion.div className="flex items-center justify-between mb-8">
          <Link
            to="/manager/reservations"
            className="p-3 bg-white rounded-xl hover:bg-slate-50 transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1E3A]">
            Détails Réservation #{reservation.idReservation}
          </h1>
          <div className="w-12" />
        </motion.div>

        {/* STATUS ALERT */}
        {isConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3"
          >
            <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-800">Réservation Confirmée!</p>
              <p className="text-sm text-emerald-700">
                Le client a reçu une confirmation de sa réservation
              </p>
            </div>
          </motion.div>
        )}

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8"
        >
          {/* CLIENT INFO */}
          <div className="border-b border-slate-100 pb-8">
            <h2 className="text-sm uppercase font-bold text-slate-400 mb-6">
              Informations du Client
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-2">Nom & Prénom</p>
                <p className="text-lg font-bold text-[#0B1E3A] flex items-center gap-2">
                  <User size={18} className="text-indigo-600" />
                  {reservation.client?.nom} {reservation.client?.prenom}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Email</p>
                <p className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                  <Mail size={18} />
                  {reservation.client?.email}
                </p>
              </div>
            </div>
          </div>

          {/* RÉSERVATION DETAILS */}
          <div className="border-b border-slate-100 pb-8">
            <h2 className="text-sm uppercase font-bold text-slate-400 mb-6">
              Détails de la Réservation
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Hôtel</p>
                <p className="font-bold text-[#0B1E3A]">
                  {reservation.chambre?.hotel?.nom || "N/A"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Chambre</p>
                <p className="font-bold text-[#0B1E3A]">
                  {reservation.chambre?.nom || "N/A"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Nuits</p>
                <p className="font-bold text-[#0B1E3A]">{nights} nuit{nights > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-xs text-slate-500 mb-2">Date d'Arrivée</p>
                <div className="flex items-center gap-2 font-bold text-[#0B1E3A]">
                  <Calendar size={18} className="text-indigo-600" />
                  {new Date(reservation.dateArrivee).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Date de Départ</p>
                <div className="flex items-center gap-2 font-bold text-[#0B1E3A]">
                  <Calendar size={18} className="text-indigo-600" />
                  {new Date(reservation.dateDepart).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MONTANT */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <p className="text-sm text-slate-600 mb-2">Montant à Percevoir</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-600">
                {reservation.montantTotal.toLocaleString("fr-FR")}
              </span>
              <span className="text-lg font-bold text-emerald-700">FCFA</span>
            </div>
          </div>

          {/* ACTIONS */}
          {!isConfirmed && (
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h2 className="text-sm uppercase font-bold text-slate-400 mb-6">
                Actions
              </h2>

              {!showRejectForm ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Confirmation en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Confirmer la Réservation
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isProcessing}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-all border border-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Refuser
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
                  <p className="text-sm font-bold text-red-800">Motif de Refus</p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Expliquez pourquoi vous refusez cette réservation..."
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                    rows={4}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleReject}
                      disabled={isProcessing || !rejectReason.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin mx-auto" />
                      ) : (
                        "Confirmer le Refus"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason("");
                      }}
                      disabled={isProcessing}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded-lg transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* CLIENT NOTICE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <p className="text-sm text-blue-800">
            <span className="font-bold">Note:</span> Le client recevra une
            notification par email confirmant {isConfirmed ? "" : "ou réfutant"} sa
            réservation.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
