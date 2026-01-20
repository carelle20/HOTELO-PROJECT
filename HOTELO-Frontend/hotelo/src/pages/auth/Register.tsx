import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, XCircle, Info } from "lucide-react";
import registerHotel from "/assets/register-hotel.jpg";

type UserRole = "CLIENT" | "HOTEL_MANAGER";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const isPasswordStrong = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!isPasswordStrong) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
      return;
    }
    if (!acceptTerms) {
      setError("Veuillez cocher la case des conditions générales.");
      return;
    }

    register(`${nom} ${prenom}`, email, role);
    navigate(role === "HOTEL_MANAGER" ? "/dashboard" : "/");
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full bg-slate-50/50 p-4 md:p-8 gap-6 md:gap-12 items-center justify-center">
      
      {/* FORMULAIRE */}
      <div className="w-full lg:w-1/3 flex items-center justify-center order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md bg-white rounded-[1.5rem] shadow-xl p-6 md:p-10 border border-slate-100"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#0B1E3A]">Créer un compte</h1>
            <p className="text-slate-500 mt-2 font-medium">Rejoignez Hotelo dès aujourd'hui.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold flex items-center gap-2 rounded-r-lg"
            >
              <XCircle size={14} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Nom <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="Nom" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Prénom <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="Prénom" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="exemple@hotelo.cm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Mot de passe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 pl-11 pr-11 py-2.5 focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Confirmation <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full rounded-xl border pl-11 pr-4 py-2.5 outline-none transition ${confirmPassword && password !== confirmPassword ? "border-red-300 ring-red-100" : "border-slate-200 focus:ring-yellow-400"}`} placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* Instructions mot de passe */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-start gap-2">
              <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-500 leading-tight">
                Le mot de passe doit contenir au moins <span className="font-bold">8 caractères</span>, une <span className="font-bold">majuscule</span>, une <span className="font-bold">minuscule</span> et un <span className="font-bold">chiffre</span>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Type de compte <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
                <button type="button" onClick={() => setRole("CLIENT")} className={`py-2.5 rounded-xl text-sm font-bold transition-all ${role === "CLIENT" ? "bg-[#0B1E3A] text-yellow-400 shadow-sm" : "text-slate-500"}`}>Client</button>
                <button type="button" onClick={() => setRole("HOTEL_MANAGER")} className={`py-2.5 rounded-xl text-sm font-bold transition-all ${role === "HOTEL_MANAGER" ? "bg-[#0B1E3A] text-yellow-400 shadow-sm" : "text-slate-500"}`}>Hôtelier</button>
              </div>
            </div>

            <div className="flex items-start gap-3 px-1 mt-2 text-center">
              <input id="terms" type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-4 h-4 mt-0.5 text-[#0B1E3A] border-slate-300 rounded focus:ring-yellow-400 cursor-pointer" />
              <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight cursor-pointer select-none">
                J'accepte les <Link to="/terms" className="text-[#0B1E3A] font-bold hover:underline">Conditions Générales d'Utilisation</Link> et la <Link to="/privacy" className="text-[#0B1E3A] font-bold hover:underline">Politique de Confidentialité</Link> <span className="text-red-500">*</span>
              </label>
            </div>

            <button type="submit" disabled={!acceptTerms} className={`w-full cursor-pointer rounded-xl py-4 font-bold transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${acceptTerms ? "bg-yellow-400 text-[#0B1E3A] hover:bg-yellow-300" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
              S’inscrire maintenant
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Déjà un compte ? <Link to="/connexion" className="text-[#0B1E3A] font-black hover:underline decoration-yellow-400 decoration-2 underline-offset-4">Se connecter</Link>
          </p>
        </motion.div>
      </div>

      {/* IMAGE */}
      <div className="hidden lg:block lg:w-1/3 h-[550px] relative overflow-hidden rounded-[1.5rem] shadow-xl order-2 self-center">
        <img src={registerHotel} alt="Beach Resort" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0B1E3A]/40 backdrop-blur-[1px] flex items-center p-8">
           <div className="max-w-md text-white">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-yellow-400" size={24} />
                <span className="uppercase tracking-widest text-xs font-bold">Avantages exclusifs</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">Accédez aux meilleures offres d'hôtels.</h2>
              <p className="text-md text-slate-100 opacity-90 border-l-4 border-yellow-400 pl-4">Rejoignez nous et explorez le Cameroun.</p>
           </div>
        </div>
      </div>
    </div>
  );
}