import {
  CalendarCheck,
  Wallet,
  BedDouble,
  TrendingUp,
  Plus,
  Hotel,
  Headphones,
  type LucideIcon,
} from "lucide-react";

const stats : {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon; 
  bg: string;
  color: string;
}[] = [
  {
    title: "Réservations actives",
    value: "12",
    subtitle: "Aujourd’hui",
    icon: CalendarCheck,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Revenus du mois",
    value: "1 250 000 FCFA",
    subtitle: "Mars 2025",
    icon: Wallet,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Chambres disponibles",
    value: "18",
    subtitle: "Sur 30",
    icon: BedDouble,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
  {
    title: "Taux d’occupation",
    value: "76%",
    subtitle: "Ce mois",
    icon: TrendingUp,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-10">
      {/* KPI */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Actions rapides
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            icon={Hotel}
            label="Ajouter un hôtel"
            color="bg-blue-100 text-blue-600"
          />
          <ActionCard
            icon={Plus}
            label="Ajouter une chambre"
            color="bg-yellow-100 text-yellow-600"
          />
          <ActionCard
            icon={CalendarCheck}
            label="Voir les réservations"
            color="bg-green-100 text-green-600"
          />
          <ActionCard
            icon={Headphones}
            label="Support"
            color="bg-purple-100 text-purple-600"
          />
        </div>
      </div>

      {/* Réservations récentes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Réservations récentes
        </h3>

        <div className="space-y-3">
          <ReservationItem
            client="Jean Dupont"
            date="12 Mars 2025"
            status="Confirmée"
          />
          <ReservationItem
            client="Amina Bello"
            date="11 Mars 2025"
            status="En attente"
          />
        </div>
      </div>

      {/* Activité */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Activité récente
        </h3>

        <div className="h-48 flex items-center justify-center text-gray-400">
          📊 Graphiques & statistiques à venir
        </div>
      </div>
    </div>
  );
}

/* ---------- Composants internes ---------- */

function ActionCard({
  icon: Icon,
  label,
  color,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
}) {
  return (
    <button className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:shadow transition">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon size={18} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

function ReservationItem({
  client,
  date,
  status,
}: {
  client: string;
  date: string;
  status: string;
}) {
  const statusColor =
    status === "Confirmée"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
      <div>
        <p className="text-sm font-medium text-gray-800">{client}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
}
