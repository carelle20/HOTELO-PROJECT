import { useEffect, useState } from "react";
import { 
  Hotel, Users, Clock, CalendarCheck, Loader2, AlertCircle 
} from "lucide-react";
import  type { AdminStats } from "../../services/admin.service";
import { adminService } from "../../services/admin.service";
import { toast } from "sonner";

export default function AdminDashboard() {
  // État pour stocker les statistiques réelles
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des données 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        toast.error("Erreur de connexion au serveur", {
          description: "Impossible de récupérer les statistiques en temps réel."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // État de chargement
  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#0B1E3A]" size={40} />
        <p className="font-medium animate-pulse">Synchronisation avec la base de données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-gray-500 font-medium">
          Vue globale de la plateforme <span className="text-[#0B1E3A] font-bold">HOTELO</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Hôtels enregistrés"
          value={stats?.hotelsCount?.toString() || "0"}
          icon={<Hotel size={22} />}
          color="bg-blue-100 text-blue-700"
        />
        <KpiCard
          title="Responsables d'hôtel"
          value={stats?.managersCount?.toString() || "0"}
          icon={<Users size={22} />}
          color="bg-green-100 text-green-700"
        />
        <KpiCard
          title="En attente de validation"
          value={stats?.pendingValidationCount?.toString() || "0"}
          icon={<Clock size={22} />}
          color="bg-yellow-100 text-yellow-700"
        />
        <KpiCard
          title="Réservations totales"
          value={stats?.totalBookings?.toString() || "0"}
          icon={<CalendarCheck size={22} />}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Activité récente</h2>
          <div className="h-64 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-50 rounded-xl">
             <AlertCircle size={40} className="mb-2 opacity-20" />
             <p className="text-sm">Le graphique sera disponible après les premières transactions.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Validations prioritaires</h2>
        </div>
      </div>
    </div>
  );
}

/* --- Composants réutilisables --- */

function KpiCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-inner`}>
        {icon}
      </div>
    </div>
  );
}