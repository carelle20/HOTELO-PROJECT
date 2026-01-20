import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Calendar, Users, CreditCard, ArrowLeft, Info } from "lucide-react";

export default function Reservation() {
//   const { id } = useParams();
  const navigate = useNavigate();
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données de réservation :", formData);
    // Ici tu ajouteras l'appel API plus tard
    alert("Demande de réservation envoyée !");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Bouton Retour */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : Récapitulatif (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Votre séjour</h2>
              
              {/* On simule ici les données de l'hôtel récupérées via l'ID */}
              <div className="space-y-4">
                <div className="aspect-video rounded-2xl bg-slate-200 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=500" alt="Hotel" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Hôtel Prestige Douala</h3>
                  <p className="text-sm text-slate-500">Chambre Deluxe Double</p>
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Prix par nuit</span>
                  <span className="font-semibold text-slate-900">45,000 FCFA</span>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-2xl flex gap-3">
                  <Info className="text-yellow-600 shrink-0" size={18} />
                  <p className="text-xs text-yellow-700">
                    Annulation gratuite jusqu'à 24h avant l'arrivée.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1 : Dates & Voyageurs */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Détails de la réservation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Arrivée</label>
                    <input 
                      type="date" 
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                      onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Départ</label>
                    <input 
                      type="date" 
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                      onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de personnes</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                      type="number" min={1} defaultValue={1} required 
                        className="w-full p-3 pl-10 rounded-xl border border-slate-200 appearance-none outline-none"
                        onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                      >
                      </input>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 : Informations personnelles */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Users size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Vos informations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" placeholder="Prénom" required
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-500"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Nom" required
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-500"
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email" required
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-500"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    type="tel" placeholder="Téléphone" required
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-500"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <div className="md:col-span-2">
                    <textarea 
                      placeholder="Demandes spéciales (Optionnel)"
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-500"
                      onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* Bouton de confirmation */}
              <button 
                type="submit"
                className="w-full bg-[#0B1E3A] text-yellow-400 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <CreditCard size={22} />
                Confirmer la réservation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}