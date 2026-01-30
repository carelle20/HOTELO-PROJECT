// src/context/AuthProvider.tsx
import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth.context";
import type { User, LoginResponse, RegisterData } from "./auth.types";
import { authService } from "../services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import { TriangleAlert, Copy, Check, X } from "lucide-react";
import type { AxiosError } from "axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("hotelo_user");
    const token = localStorage.getItem("hotelo_token");
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const refreshUser = useCallback(async () => {
    try {
      const updatedUser = await authService.getProfile();
      if (updatedUser) {
        // 1. On met à jour l'état React
        setUser(updatedUser); 
        // 2. ON MET À JOUR LE STORAGE (Crucial !)
        localStorage.setItem("hotelo_user", JSON.stringify(updatedUser));
        console.log("Sync réussie, nouveau statut :", updatedUser.estValide);
      } 
    } catch (error) {
        console.error("Échec de la synchronisation du profil :", error);
      }
  }, []);
  // 4. L'effet de chargement initial
  // useEffect(() => {
  //   if (user) {
  //     refreshUser();
  //   }
  // }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- LOGIN AVEC AXIOS ---
  const login = async (email: string, motDePasse: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      // On utilise le service Axios
      const data = await authService.login({ email, motDePasse });

      // Note : Axios lève une erreur automatiquement si success est false ou status >= 400
      localStorage.setItem("hotelo_token", data.token);
      localStorage.setItem("hotelo_user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.nouveauMdpAuto) {
        setTempPassword(data.nouveauMdpAuto);
      }

      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMsg = axiosError.response?.data?.message || "Identifiants incorrects";
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER AVEC AXIOS ---
  const register = async (formData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.register(formData);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMsg = axiosError.response?.data?.message || "Erreur lors de l'inscription";
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("hotelo_token");
    localStorage.removeItem("hotelo_user");
    setUser(null);
    window.location.href = "/connexion";
  }, []);

  return (
    <AuthContext.Provider 
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
      
      <AnimatePresence>
        {tempPassword && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B1E3A]/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 relative"
            >
              <button 
                onClick={() => setTempPassword(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X size={20} className="text-slate-400" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TriangleAlert className="text-yellow-600" size={30} />
                </div>
                
                <h3 className="text-xl font-black text-[#0B1E3A] mb-2">Attention!</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Ceci est votre mot de passe définitif. Veuillez le copier et le conserver précieusement.
                </p>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-between mb-8">
                  <span className="font-mono text-xl font-bold text-[#0B1E3A] tracking-wider">
                    {tempPassword}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(tempPassword)}
                    className="p-2 hover:bg-white rounded-lg shadow-sm transition-all"
                    type="button"
                  >
                    {copied ? <Check className="text-green-500" size={20} /> : <Copy className="text-slate-400" size={20} />}
                  </button>
                </div>

                <button 
                  onClick={() => setTempPassword(null)}
                  className="w-full bg-[#0B1E3A] text-yellow-400 py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  J'ai bien noté
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};