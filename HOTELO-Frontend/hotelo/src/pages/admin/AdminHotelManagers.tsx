import { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Search,
  ShieldCheck, Loader2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/admin.service";
import type { HotelManager } from "../../interfaces/admin.interface";

export default function AdminHotelManagers() {
  const [managers, setManagers] = useState<HotelManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"en_attente" | "approuve">("en_attente");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllManagers();
      if (Array.isArray(data)) {
        setManagers(data);
      } else {
        console.error("adminService.getAllManagers() n'a pas retourné un tableau:", data);
        setManagers([]); // Réinitialise à un tableau vide si les données sont inattendues
        toast.error("Format de données inattendu des gérants");
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les gérants");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredManagers = managers.filter(m => {
    const matchesTab = activeTab === "en_attente" ? !m.estValide : m.estValide;
    
    const searchLower = searchTerm.toLowerCase();
    const nomComplet = `${m.prenom} ${m.nom}`.toLowerCase();
    const nomHotel = m.profilChefHotel?.nom_hotel?.toLowerCase() || "";
    const email = m.email.toLowerCase();

    const matchesSearch = 
      nomComplet.includes(searchLower) || 
      nomHotel.includes(searchLower) ||
      email.includes(searchLower);

    return matchesTab && matchesSearch;
  });

  const handleApprove = async (id: number) => {
    console.log("Tentative de validation pour l'ID:", id);
    try {
      await adminService.validateManager(id);
      setManagers(prev => prev.map(m => 
        m.idUtilisateur === id ? { ...m, estValide: true } : m
      ));
      toast.success("Hôtelier validé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la validation");
    }
  };

  const handleReject = () => {

  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Chargement des dossiers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Validation des responsables d'hôtels</h1>
          <p className="text-slate-500 text-sm font-medium">Gérez les demandes d'accès des partenaires hôteliers.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <TabButton 
            active={activeTab === "en_attente"} 
            onClick={() => setActiveTab("en_attente")}
            label="En attente" 
            count={managers.filter(m => !m.estValide).length}
          />
          <TabButton 
            active={activeTab === "approuve"} 
            onClick={() => setActiveTab("approuve")}
            label="Approuvés" 
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, hôtel ou email..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Gérant & Hôtel</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Contact</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager) => (
                  <tr key={manager.idUtilisateur} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {manager.profilChefHotel?.nom_hotel?.[0] || manager.nom[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{manager.profilChefHotel?.nom_hotel || "Hôtel non défini"}</p>
                          <p className="text-xs text-slate-500 font-medium">{manager.prenom} {manager.nom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-xs text-slate-600 font-bold">{manager.email}</p>
                       <p className="text-[10px] text-slate-400 font-medium">{manager.profilChefHotel?.telephone || "Pas de téléphone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {activeTab === "en_attente" && (
                          <>
                            {/* Bouton Refuser amélioré avec texte */}
                            <button 
                              onClick={() => handleReject()}
                              className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all text-xs font-bold"
                            >
                              <XCircle size={16} />
                              Refuser
                            </button>

                            <button 
                              onClick={() => handleApprove(manager.idUtilisateur)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all active:scale-95"
                            >
                              <ShieldCheck size={16} />
                              Approuver
                            </button>
                          </>
                        )}
                        {activeTab === "approuve" && (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                             <CheckCircle size={14} />
                             <span className="text-[10px] font-black uppercase">Compte Actif</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <AlertCircle size={48} className="text-slate-400" />
                      <p className="font-bold text-slate-500">
                        {searchTerm ? "Aucun résultat pour cette recherche" : "Aucun dossier dans cette catégorie"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
        active 
          ? "bg-[#0B1E3A] text-white shadow-lg" 
          : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
          {count}
        </span>
      )}
    </button>
  );
}