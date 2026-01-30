// src/pages/auth/Register.tsx
import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import type { RegisterData } from "../../context/auth.types";
import { 
  User, Mail, Lock, Eye, EyeOff, CheckCircle2, 
  XCircle, Check, Hotel, MapPin, Phone
} from "lucide-react";
import registerHotel from "/assets/register-hotel.jpg";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
    role: "client",
    nomHotel: "",
    adresseHotel: "",
    telephone: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // CRITERES  DE VALIDATION DU MOT DE PASSE
  const passwordValidation = useMemo(() => {
    const p = formData.motDePasse;
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
    };
  }, [formData.motDePasse]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
      return;
    }

    if (formData.motDePasse !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      
      const isHotel = formData.role === "chef_hotel";
      toast.success("Inscription réussie !", {
        description: isHotel 
          ? "Votre compte hôtelier est en attente de validation par l'équipe Hotelo." 
          : "Bienvenue ! Votre compte client est prêt.",
        duration: 5000,
      });
      // Redirection après le toast
      setTimeout(() => {
        navigate("/connexion");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      setError(message);
      toast.error("Échec de l'inscription", {
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full bg-slate-50/50 p-4 md:p-8 gap-6 md:gap-12 items-center justify-center font-sans">
      
      {/* SECTION FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl bg-white rounded-[1.5rem] shadow-xl p-6 md:p-10 border border-slate-100"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#0B1E3A]">Créer un compte</h1>
            <p className="text-slate-500 mt-2 font-medium italic text-sm">Sélectionnez votre profil</p>
          </div>

          {/* SÉLECTEUR DE RÔLE (Prioritaire) */}
          <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, role: "client"})} 
              className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.role === "client" ? "bg-[#0B1E3A] text-yellow-400 shadow-md" : "text-slate-500"}`}
            >
              Client
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, role: "chef_hotel"})} 
              className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.role === "chef_hotel" ? "bg-[#0B1E3A] text-yellow-400 shadow-md" : "text-slate-500"}`}
            >
              Hôtelier
            </button>
          </div>

          {error && (
            <motion.div animate={{ x: [-5, 5, -5, 5, 0] }} className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold flex items-center gap-2 rounded-r-lg">
              <XCircle size={14} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* INFOS PERSONNELLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Nom <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="nom" required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none transition text-sm" placeholder="Votre nom" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Prénom <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="prenom" required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none transition text-sm" placeholder="Votre prénom" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Email<span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="email" type="email" required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none transition text-sm" placeholder="exemple@hotelo.com" />
              </div>
            </div>

            {/* CHAMPS HÔTELIER DYNAMIQUES */}
            <AnimatePresence>
              {formData.role === "chef_hotel" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-5 border-t border-slate-100"
                >
                  <h3 className="text-[#0B1E3A] font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2 justify-center">
                    Détails de l'établissement
                  </h3>
                  <p className="text-[12px] font-semibold text-slate-500 italic flex items-center gap-2 justify-center">
                    Veuillez renseigner les coordonnées de votre hôtel pour justification
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Nom de l'Hôtel <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Hotel className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="nomHotel" required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Ex: Hilton" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Numéro de Téléphone <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="telephone" required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400" placeholder="6XX XXX XXX" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Adresse de l'Hôtel <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="adresseHotel" required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Ville, Quartier, Rue" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MOT DE PASSE ET CONFIRMATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Mot de passe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="motDePasse" type={showPassword ? "text" : "password"} required onChange={handleChange} className="w-full rounded-xl border border-slate-200 pl-11 pr-11 py-3 focus:ring-2 focus:ring-yellow-400 outline-none transition text-sm" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Confirmation <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full rounded-xl border pl-11 pr-4 py-3 outline-none transition text-sm ${confirmPassword && formData.motDePasse !== confirmPassword ? "border-red-300 bg-red-50" : "border-slate-200 focus:ring-yellow-400"}`} placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* VALIDATION TEMPS RÉEL DU MOT DE PASSE */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-2 gap-3">
              <PasswordCheck label="8+ caractères" isValid={passwordValidation.length} />
              <PasswordCheck label="Une Majuscule" isValid={passwordValidation.upper} />
              <PasswordCheck label="Une Minuscule" isValid={passwordValidation.lower} />
              <PasswordCheck label="Un Chiffre" isValid={passwordValidation.number} />
            </div>

            <div className="flex items-start gap-3 px-1">
              <input id="terms" type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-4 h-4 mt-0.5 text-[#0B1E3A] border-slate-300 rounded focus:ring-yellow-400 cursor-pointer" />
              <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight cursor-pointer">
                J'accepte les <Link to="/terms" className="text-[#0B1E3A] font-bold hover:underline tracking-tight">Conditions Générales d'Utilisation</Link> et la <Link to="/privacy" className="text-[#0B1E3A] font-bold hover:underline tracking-tight">Politique de Confidentialité</Link> <span className="text-red-500">*</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={!acceptTerms || isLoading} 
              className={`w-full rounded-xl py-4 font-bold transition-all shadow-lg flex justify-center items-center gap-2 ${acceptTerms && !isLoading ? "bg-yellow-400 text-[#0B1E3A] hover:bg-yellow-300 active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-[#0B1E3A]/20 border-t-[#0B1E3A] rounded-full animate-spin"></div> : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Déjà inscrit ? <Link to="/connexion" className="text-[#0B1E3A] font-black hover:underline decoration-yellow-400 decoration-2 underline-offset-4">Se connecter</Link>
          </p>
        </motion.div>
      </div>

      {/* SECTION IMAGE */}
      <div className="hidden lg:block lg:w-1/3 h-[550px] relative overflow-hidden rounded-[1.5rem] shadow-xl order-2 self-center">
        <img src={registerHotel} alt="Beach Resort" className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-[#0B1E3A]/40 backdrop-blur-[1px] flex items-center p-8">
            <div className="max-w-md text-white">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-yellow-400" size={24} />
                <span className="uppercase tracking-widest text-xs font-bold">Avantages exclusifs</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">Accédez aux meilleures offres d'hôtels.</h2>
              <p className="text-md text-slate-100 opacity-90 border-l-4 border-yellow-400 pl-4 font-medium">Rejoignez-nous et explorez le Cameroun depuis Hotelo.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

// Composant interne pour les critères du mot de passe
function PasswordCheck({ label, isValid }: { label: string; isValid: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold transition-all duration-300 ${isValid ? "text-green-600" : "text-slate-400"}`}>
      {isValid ? (
        <Check size={14} className="bg-green-100 rounded-full p-0.5" strokeWidth={3} />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1.5" />
      )}
      <span className={isValid ? "translate-x-0" : "translate-x-1"}>{label}</span>
    </div>
  );
}