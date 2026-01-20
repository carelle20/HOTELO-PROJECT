import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import loginHotel from "/assets/login-hotel.jpg";

type UserRole = "CLIENT" | "HOTEL_MANAGER";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // États du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  
  // États d'interface
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      login(email, role);

      if (role === "HOTEL_MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Conteneur principal avec padding pour détacher du header/footer
    <div className="flex-1 flex flex-col lg:flex-row w-full bg-slate-50/50 p-4 md:p-8 gap-6 md:gap-12 items-center justify-center">
      
      {/* SECTION IMAGE */}
      <div className="hidden lg:block lg:w-1/3 h-[500px] relative overflow-hidden rounded-[1.5rem] shadow-xl self-center">
        <img 
          src={loginHotel}
          alt="Lobby d'hôtel luxueux" 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-[#0B1E3A]/40 backdrop-blur-[1px] flex items-center justify-center p-8">
          <div className="max-w-md text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4 leading-tight">Bon retour parmi nous.</h2>
              <p className="text-md text-slate-100 opacity-90 border-l-4 border-yellow-400 pl-4">
                Connectez-vous pour accéder à vos informations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECTION FORMULAIRE */}
      <div className="w-full lg:w-1/3 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md bg-white rounded-[1.5rem] shadow-xl p-6 md:p-10 border border-slate-100"
        >
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-[#0B1E3A]">Connexion</h1>
            <p className="text-slate-500 mt-2 font-medium">Accedez a votre espace personnel !</p>
          </div>

          {/* Affichage de l'erreur */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-r-xl"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none transition bg-white"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-sm font-bold text-slate-700">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-slate-400 hover:text-[#0B1E3A] transition">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-11 pr-12 py-3 focus:ring-2 focus:ring-yellow-400 outline-none transition bg-white"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sélecteur de rôle */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                Se connecter en tant que : <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button" onClick={() => setRole("CLIENT")}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    role === "CLIENT" ? "bg-[#0B1E3A] text-yellow-400 shadow-sm" : "text-slate-500"
                  }`}
                >Client</button>
                <button
                  type="button" onClick={() => setRole("HOTEL_MANAGER")}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    role === "HOTEL_MANAGER" ? "bg-[#0B1E3A] text-yellow-400 shadow-sm" : "text-slate-500"
                  }`}
                >Hôtelier</button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-yellow-400 text-[#0B1E3A] cursor-pointer rounded-xl py-4 font-bold transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-300"
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-[#0B1E3A]/20 border-t-[#0B1E3A] rounded-full animate-spin"></div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10 font-medium">
            Nouveau sur Hotelo ?{" "}
            <Link to="/inscription" className="text-[#0B1E3A] font-black hover:underline decoration-yellow-400 decoration-2 underline-offset-4">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}