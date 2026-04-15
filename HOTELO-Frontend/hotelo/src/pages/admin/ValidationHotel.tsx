import { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Search, MapPin, 
  ShieldCheck, Loader2, Building2
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/admin.service";
import api from "../../api/axios";

interface Hotel {
  idHotel: number;
  nom: string;
  ville: string;
  pays: string;
  numeroRegistre: string;
  statut: "en_attente" | "valider" | "refuser" | "brouillon";
  prixMin: number;
  chefHotel: {
    prenom: string;
    nom: string;
    email: string;
  };
  images: { url: string; estPrincipale: boolean }[];
}

export default function AdminValidationHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"en_attente" | "valider" | "refuser">("en_attente");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllHotels();
      setHotels(data);
    } catch (error) {
        console.error(error);
      toast.error("Impossible de charger les hôtels");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHotels = hotels.filter(h => {
    const matchesTab = h.statut === activeTab;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      h.nom.toLowerCase().includes(searchLower) || 
      h.ville.toLowerCase().includes(searchLower) ||
      h.numeroRegistre.toLowerCase().includes(searchLower);

    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = async (id: number, nouveauStatut: "valider" | "refuser") => {
    try {
      await adminService.updateHotelStatus(id, nouveauStatut);
      setHotels(prev => prev.map(h => 
        h.idHotel === id ? { ...h, statut: nouveauStatut } : h
      ));
      toast.success(`Hôtel ${nouveauStatut === "valider" ? "approuvé" : "refusé"} !`);
    } catch (error) {
        console.error(error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Analyse des établissements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Validation des Établissements</h1>
          <p className="text-slate-500 text-sm font-medium">Vérifiez la conformité des hôtels avant leur mise en ligne.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <TabButton 
            active={activeTab === "en_attente"} 
            onClick={() => setActiveTab("en_attente")}
            label="En attente" 
            count={hotels.filter(h => h.statut === "en_attente").length}
          />
          <TabButton 
            active={activeTab === "valider"} 
            onClick={() => setActiveTab("valider")}
            label="Approuvés" 
          />
          <TabButton 
            active={activeTab === "refuser"} 
            onClick={() => setActiveTab("refuser")}
            label="Refusés" 
          />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, ville ou N° Registre..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Hôtel & Localisation</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Propriétaire</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Document</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <tr key={hotel.idHotel} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                          {hotel.images?.[0] ? (
                            <img src={`${api}${hotel.images.find(i => i.estPrincipale)?.url || hotel.images[0].url}`} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-full h-full p-2 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{hotel.nom}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin size={10} /> {hotel.ville}, {hotel.pays}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-slate-700">{hotel.chefHotel.prenom} {hotel.chefHotel.nom}</p>
                      <p className="text-slate-400">{hotel.chefHotel.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono text-slate-600 w-fit">
                        {hotel.numeroRegistre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {activeTab === "en_attente" ? (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(hotel.idHotel, "refuser")}
                              className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all text-xs font-bold flex items-center gap-1"
                            >
                              <XCircle size={16} /> Refuser
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(hotel.idHotel, "valider")}
                              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-md transition-all flex items-center gap-1"
                            >
                              <ShieldCheck size={16} /> Valider
                            </button>
                          </>
                        ) : (
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase ${
                            hotel.statut === "valider" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                          }`}>
                            {hotel.statut === "valider" ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                            {hotel.statut}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 opacity-50 italic">
                    Aucun hôtel trouvé dans cette catégorie.
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

// Réutilisation de ton TabButton avec un style cohérent
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
      {count !== undefined && count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20 text-white" : "bg-rose-500 text-white"}`}>
          {count}
        </span>
      )}
    </button>
  );
}