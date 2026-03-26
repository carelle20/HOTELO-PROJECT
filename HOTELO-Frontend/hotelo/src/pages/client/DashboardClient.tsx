// src/pages/client/DashboardClient.tsx
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { toast } from "sonner";
import { clientService } from "../../services/client.service";
import type { ClientDashboardStats, Reservation } from "../../interfaces/client.interface";
import {
  CalendarCheck,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import ReservationCard from "../../components/client/ReservationCard";

interface StatCard {
  title: string;
  value: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

export default function DashboardClient() {
  const { user } = useAuth();
  const hasNotified = useRef(false);

  const [stats, setStats] = useState<ClientDashboardStats | null>(null);
  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !hasNotified.current) {
      toast.success("Bienvenue sur votre tableau de bord !", {
        description: `Heureux de vous revoir, ${user.prenom}`,
        icon: <CheckCircle size={20} />,
      });
      hasNotified.current = true;
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, reservationsData] = await Promise.all([
          clientService.getDashboardStats(),
          clientService.getUpcomingReservations(),
        ]);
        setStats(statsData);
        setUpcomingReservations(reservationsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Total réservations",
      value: stats?.totalReservations.toString() || "0",
      icon: CalendarCheck,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "À venir",
      value: stats?.upcomingStays.toString() || "0",
      icon: Clock,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
    {
      title: "Annulées",
      value: stats?.cancelledReservations.toString() || "0",
      icon: TrendingUp,
      bg: "bg-red-50",
      color: "text-red-600",
    },
    {
      title: "Total dépensé",
      value: `${stats?.totalSpent || 0}€`,
      icon: Wallet,
      bg: "bg-green-50",
      color: "text-green-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0B1E3A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0B1E3A] mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Gérez vos réservations et consultez vos statistiques
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`${stat.bg} rounded-lg p-6 border border-gray-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Reservations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1E3A]">
              Réservations à venir
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Consultez vos prochaines réservations
            </p>
          </div>
        </div>

        {upcomingReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingReservations.slice(0, 5).map((reservation) => (
              <ReservationCard key={reservation.idReservation} reservation={reservation} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <CalendarCheck size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">Aucune réservation à venir</p>
            <p className="text-sm text-gray-500">
              Découvrez nos hôtels et réservez votre séjour !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
