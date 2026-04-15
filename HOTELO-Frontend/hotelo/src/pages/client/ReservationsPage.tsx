import { useEffect, useState, useMemo } from "react";
import { clientService } from "../../services/client.service";
import { type Reservation } from "../../interfaces/client.interface";
import { toast } from "sonner";
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  XCircle, 
  Hotel,
  Calendar,
  Trash2
} from "lucide-react";

type FilterType = "toutes" | "à venir" | "passées" | "annulées";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Reservation; direction: 'asc' | 'desc' } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des donnees", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReservations();
  }, []);

  const processedReservations = useMemo(() => {
    let result = reservations.filter(r => !hiddenIds.includes(r.idReservation));
    const now = new Date();

    // 1. Filtre par onglet
    if (activeFilter === "à venir") {
      result = result.filter(r => new Date(r.dateArrivee) > now && r.statut !== "annulée");
    } else if (activeFilter === "passées") {
      result = result.filter(r => new Date(r.dateDepart) < now);
    } else if (activeFilter === "annulées") {
      result = result.filter(r => r.statut === "annulée");
    }

    // 2. Recherche 
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.hotel?.nom.toLowerCase().includes(q) || 
        r.hotel?.ville.toLowerCase().includes(q) ||
        r.idReservation.toString().includes(q)
      );
    }

    // 3. Tri
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue! < bValue!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue! > bValue!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [reservations, activeFilter, searchQuery, sortConfig, hiddenIds]);

  const requestSort = (key: keyof Reservation) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getStatusStyle = (statut: string) => {
    switch (statut) {
      case "confirmée": return "bg-green-100 text-green-700";
      case "annulée": return "bg-red-100 text-red-700";
      case "en_attente": return "bg-amber-100 text-amber-700";
      case "complétée": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }
    try {
      const response = await clientService.cancelReservation(id, "Annulation par le client");
      if (response.success) {
        toast.success("Réservation annulée avec succès");
        // Rafraîchir les données localement
        fetchReservations(); 
      } else {
        toast.error(response.message || "Impossible d'annuler la réservation");
      }
    } catch (error) {
      console.error("Erreur annulation:", error);
      toast.error("Une erreur est survenue lors de l'annulation");
    }
  };

  const handleHideRow = (id: number) => {
    if (window.confirm("Voulez-vous masquer cette réservation de votre affichage actuel ?")) {
      setHiddenIds(prev => [...prev, id]);
      toast.success("Ligne masquée temporairement");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0B1E3A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre d'outils supérieure */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(["toutes", "à venir", "passées", "annulées"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeFilter === f ? "bg-white text-[#0B1E3A] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="capitalize">{f}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher une réservation..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B1E3A] outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th onClick={() => requestSort('idReservation')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-[#0B1E3A]">
                  <div className="flex items-center gap-1">ID <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Infos Hôtel</th>
                <th onClick={() => requestSort('dateArrivee')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase cursor-pointer">
                  <div className="flex items-center gap-1">Durée du séjour <ArrowUpDown size={12}/></div>
                </th>
                <th onClick={() => requestSort('montantTotal')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase cursor-pointer">
                  <div className="flex items-center gap-1">Total <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedReservations.map((res) => (
                <tr key={res.idReservation} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">#{res.idReservation}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Hotel size={18}/></div>
                      <div>
                        <div className="font-bold text-gray-900">{res.hotel?.nom || "Chargement..."}</div>
                        <div className="text-xs text-gray-500">{res.hotel?.ville}, {res.hotel?.adresse}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">Du {new Date(res.dateArrivee).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">au {new Date(res.dateDepart).toLocaleDateString()} ({res.nombreNuits} nuits)</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{res.montantTotal.toLocaleString()} €</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(res.statut)}`}>
                      {res.statut.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      {(res.statut === "confirmée" || res.statut === "en_attente") ? (
                        <button 
                          onClick={() => {
                            setSelectedReservation(res);
                            setIsEditModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-md transition-all border border-blue-100 shadow-sm"
                        >
                          <Eye size={14} />
                          Modifier
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleHideRow(res.idReservation)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 cursor-pointer hover:text-red-800 hover:bg-red-200"

                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {(res.statut === "confirmée" || res.statut === "en_attente") && (
                        <button 
                          onClick={() => handleCancel(res.idReservation)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-200 hover:text-red-800 rounded-full transition-all border border-red-100 shadow-sm cursor-pointer"
                        >
                          <XCircle size={14} />
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {processedReservations.length === 0 && (
            <div className="p-20 text-center text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p>Aucun historique de réservation trouvé.</p>
            </div>
          )}
        </div>
      </div>
      {/* MODALE DE MODIFICATION */}
      {isEditModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#0B1E3A]">
                Modifier Réservation #{selectedReservation.idReservation}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updateData = {
                dateArrivee: formData.get('dateArrivee') as string,
                dateDepart: formData.get('dateDepart') as string,
              };

              try {
                await clientService.updateReservation(selectedReservation.idReservation, updateData);
                toast.success("Réservation mise à jour !");
                setIsEditModalOpen(false);
                fetchReservations(); // Rafraîchir le tableau
              } catch (error) {
                toast.error("Erreur lors de la mise à jour de la réservation");
                console.error("Erreur Update:", error);
              }
            }} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'arrivée</label>
                <input 
                  type="date" 
                  name="dateArrivee"
                  defaultValue={new Date(selectedReservation.dateArrivee).toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B1E3A] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                <input 
                  type="date" 
                  name="dateDepart"
                  defaultValue={new Date(selectedReservation.dateDepart).toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B1E3A] outline-none"
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                <div className="text-blue-600 mt-0.5"><Hotel size={18}/></div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#162d4d] font-medium shadow-lg transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}