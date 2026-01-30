// src/pages/hotel/Dashboard.tsx
import { useAuth } from "../../context/useAuth";
import { CalendarCheck, Wallet, BedDouble, TrendingUp, Plus, Hotel, Headphones, Info, CheckCircle, Clock, type LucideIcon } from "lucide-react";

/**
 * Types pour les composants internes
 */
interface StatProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

const statsData: StatProps[] = [
  {
    title: "Réservations actives",
    value: "0",
    subtitle: "Aujourd’hui",
    icon: CalendarCheck,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Revenus du mois",
    value: "0 FCFA",
    subtitle: "En attente",
    icon: Wallet,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Chambres disponibles",
    value: "0",
    subtitle: "À configurer",
    icon: BedDouble,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
  {
    title: "Taux d’occupation",
    value: "0%",
    subtitle: "Ce mois",
    icon: TrendingUp,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  // On utilise la propriété réelle du user chargé depuis le Backend via useAuth
  const isApprouve = user?.estValide === true;

  return (
    <div className="space-y-8 p-1">
      {/* Barre de statut connectée au champ 'estValide' de la BD */}
      <div 
        className={`p-5 rounded-[1.25rem] border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm transition-colors duration-500 ${
          isApprouve 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-blue-50 border-blue-100 text-blue-800"
        }`}
      >
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className={`p-2.5 rounded-full ${isApprouve ? "bg-emerald-200 text-emerald-700" : "bg-blue-200 text-blue-700"}`}>
            {isApprouve ? <CheckCircle size={22} /> : <Clock size={22} className="animate-pulse" />}
          </div>
          <div>
            <h3 className="font-bold text-base">
              {isApprouve ? "Établissement certifié Hotelo" : "Compte en cours de configuration"}
            </h3>
            <p className="text-sm opacity-80 font-medium">
              {isApprouve 
                ? "Vos offres sont actuellement visibles par les voyageurs au Cameroun." 
                : "Vous pouvez déjà enregistrer vos hôtels et chambres. Ils seront publiés après validation."}
            </p>
          </div>
        </div>
        
        {!isApprouve && (
          <div className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-200">
            Examen en cours
          </div>
        )}
      </div>

      {/* 2. KPI (CHIFFRES CLÉS) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-100 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter font-bold">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 ${stat.bg} ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ACTIONS RAPIDES (TOTALEMENT ACCESSIBLES) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-yellow-400 rounded-full" />
          <h3 className="text-lg font-bold text-slate-800">Gestion de l'établissement</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard icon={Hotel} label="Enregistrer un Hôtel" color="bg-indigo-50 text-indigo-600" />
          <ActionCard icon={Plus} label="Ajouter une Chambre" color="bg-amber-50 text-amber-600" />
          <ActionCard icon={CalendarCheck} label="Planning & Réservations" color="bg-emerald-50 text-emerald-600" />
          <ActionCard icon={Headphones} label="Support Technique" color="bg-rose-50 text-rose-600" />
        </div>
      </div>

      {/* 4. DONNÉES RÉCENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Réservations */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Dernières activités</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">Voir tout</button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 border-2 border-dashed border-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Info size={24} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Aucune réservation reçue</p>
              <p className="text-xs opacity-60">Les réservations apparaîtront ici dès que vos offres seront en ligne.</p>
            </div>
          </div>
        </div>

        {/* Graphique de Performance */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Flux des revenus</h3>
          <div className="h-56 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
             <TrendingUp size={48} className="text-slate-200 mb-4" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Données insuffisantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** * COMPOSANT : CARTE D'ACTION
 */
function ActionCard({ icon: Icon, label, color }: { icon: LucideIcon; label: string; color: string }) {
  return (
    <button className="flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-[0.97] group text-center md:text-left">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-bold text-slate-700 leading-tight">{label}</span>
    </button>
  );
}
