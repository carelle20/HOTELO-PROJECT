import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, ArrowLeft, Loader, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { clientService } from "../services/client.service";
import { type ReservationRequest } from "../interfaces/client.interface";
import { toast } from "sonner";

interface RoomDetails {
  id: number;
  nom: string;
  prix: number;
  capacite: number;
  description?: string;
  hotelId: number;
  image?: string;
}

export default function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // État pour le formulaire - simplifié comme Booking/Airbnb
  const [formData, setFormData] = useState({
    dateArrivee: "",
    dateDepart: "",
    nombrePersonnes: 1
  });
  const [roomData, setRoomData] = useState<RoomDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Veuillez vous connecter pour réserver");
      navigate("/connexion");
    }
  }, [isAuthenticated, navigate]);

  // Récupérer les données de la chambre
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) return;
      try {
        // À adapter: récupérer les vraies données de la chambre depuis l'API
        // Pour l'instant, données par défaut. À remplacer par votre API réelle
        setRoomData({
          id: parseInt(id),
          nom: "Chambre Standard",
          prix: 50000, // À remplacer par les vraies données depuis l'API
          capacite: 2,
          hotelId: 0,
          description: "Chambre confortable"
        });
      } catch (error) {
        console.error("Erreur lors du chargement de la chambre:", error);
      }
    };
    
    fetchRoomData();
  }, [id]);

  // Calculer le nombre de nuits
  const calculateNights = () => {
    if (!formData.dateArrivee || !formData.dateDepart) return 0;
    const arrival = new Date(formData.dateArrivee);
    const departure = new Date(formData.dateDepart);
    const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const basePrice = roomData ? roomData.prix * nights : 0;
  const totalPrice = basePrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast.error("Données manquantes");
      return;
    }

    if (nights <= 0) {
      toast.error("Veuillez sélectionner des dates valides");
      return;
    }

    setIsSubmitting(true);
    try {
      const reservationData: ReservationRequest = {
        chambreId: Number(id),
        hotelId: roomData?.hotelId || 0,
        dateArrivee: formData.dateArrivee,
        dateDepart: formData.dateDepart,
        nombreNuits: nights,
        montantTotal: totalPrice,
        nombrePersonnes: formData.nombrePersonnes
      };

      await clientService.createReservation(reservationData);
      
      toast.success("Réservation confirmée!");
      setTimeout(() => {
        navigate("/client/reservations");
      }, 1500);
    } catch (error) {
      console.error("Erreur réservation:", error);
      let errorMessage = "Erreur lors de la réservation";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vérifier la date minimale (aujourd'hui ou plus tard)
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4"
    >
      <div className="max-w-2xl mx-auto">
        
        {/* Bouton Retour */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : Résumé (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Résumé</h2>
              
              <div className="space-y-4">
                <div className="aspect-video rounded-xl bg-slate-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" 
                    alt="Chambre" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-bold text-slate-800">{roomData?.nom || "Chambre"}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Users size={14} /> {roomData?.capacite || 2} personnes max
                  </p>
                </div>
                
                {nights > 0 && (
                  <div className="space-y-3">
                    {/* Détail du calcul */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-semibold mb-2">DÉTAIL DU PRIX</p>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700">Prix par nuit</span>
                        <span className="font-semibold">{roomData?.prix.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700">Nombre de nuits</span>
                        <span className="font-semibold">{nights}</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 flex justify-between text-sm">
                        <span className="text-slate-700">Sous-total</span>
                        <span className="font-semibold">{basePrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex gap-2">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <p>Arrivée à partir de 14h00 • Départ avant 11h00</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLONNE DROITE : Formulaire */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Bloc 1 : Dates de séjour */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Dates de séjour
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Arrivée
                    </label>
                    <input 
                      type="date" 
                      required
                      min={today}
                      value={formData.dateArrivee}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50"
                      onChange={(e) => setFormData({...formData, dateArrivee: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Départ
                    </label>
                    <input 
                      type="date" 
                      required
                      min={formData.dateArrivee || today}
                      value={formData.dateDepart}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50"
                      onChange={(e) => setFormData({...formData, dateDepart: e.target.value})}
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 font-medium">
                    Séjour: {nights} nuit{nights > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Bloc 2 : Nombre de voyageurs */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  Voyageurs
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Nombre de personnes
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, nombrePersonnes: Math.max(1, formData.nombrePersonnes - 1)})}
                      className="w-10 h-10 rounded-lg border border-slate-300 hover:bg-slate-100 transition flex items-center justify-center font-bold text-slate-700"
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max={roomData?.capacite || 10}
                      value={formData.nombrePersonnes}
                      className="w-20 px-3 py-2 text-center rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setFormData({...formData, nombrePersonnes: Math.min(val, roomData?.capacite || 10)});
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, nombrePersonnes: Math.min((roomData?.capacite || 10), formData.nombrePersonnes + 1)})}
                      className="w-10 h-10 rounded-lg border border-slate-300 hover:bg-slate-100 transition flex items-center justify-center font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Capacité maximum: {roomData?.capacite || 2} personnes
                  </p>
                </div>
              </div>

              {/* Bloc 3 : Informations client */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Informations de réservation</h2>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-semibold">Nom et prénom</p>
                    <p className="text-slate-900 font-medium">{user?.prenom} {user?.nom}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-semibold">Email</p>
                    <p className="text-slate-900 font-medium text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Bloc 4 : Conditions */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-2">Conditions</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Annulation gratuite jusqu'à 48h avant l'arrivée</li>
                  <li>✓ Aucun frais caché</li>
                  <li>✓ Confirmation immédiate de la réservation</li>
                </ul>
              </div>

              {/* Bouton Confirmation */}
              <button 
                type="submit"
                disabled={isSubmitting || nights <= 0 || !formData.dateArrivee || !formData.dateDepart}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={22} className="animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    Réserver maintenant
                  </>
                )}
              </button>
              

              <p className="text-xs text-slate-500 text-center">
                Vous ne serez débité que si votre réservation est confirmée
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}