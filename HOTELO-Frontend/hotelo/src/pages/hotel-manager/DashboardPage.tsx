import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { toast } from "sonner";
import { type ManagerDashboardStats, type Hotel } from "../../interfaces/manager.interface";
import {
  CalendarCheck,
  Wallet,
  TrendingUp,
  Plus,
  Hotel as HotelIcon,
  Headphones,
  CheckCircle,
  Clock,
  Star,
  FileCheck,
  CheckCircle2,
  Hourglass,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  ImageOff,
  Video,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";
import { managerService } from "../../services/manager.service";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ActionCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isApprouve = user?.estValide === true;
  const hasNotified = useRef(false);

  const [data, setData] = useState<ManagerDashboardStats | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, hotelsRes] = await Promise.all([
          managerService.getDashboardStats(),
          managerService.getMyHotels(),
        ]);
        setData(statsRes);
        setHotels(hotelsRes);
      } catch (error) {
        console.error("Erreur stats:", error);
        toast.error("Erreur de connexion aux données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user && !hasNotified.current) {
      if (isApprouve) {
        toast.success(`Content de vous revoir, ${user.prenom}`, {
          icon: <CheckCircle size={20} />,
        });
      } else {
        toast.info("Compte en attente de validation", {
          icon: <Clock size={20} />,
        });
      }
      hasNotified.current = true;
    }
  }, [user, isApprouve]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-10 h-10 border-4 border-[#0B1E3A] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-tight">Consolidation de vos données...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const kpiCards = [
    {
      title: "Réservations Globales",
      value: data ? String(data.totalReservations || 0) : "0",
      subtitle: `${data?.reservationsEnAttente?.length || 0} à traiter`,
      icon: CalendarCheck,
      bg: "bg-blue-100",
      color: "text-blue-700",
      trend: "+12%",
      up: true,
    },
    {
      title: "Chiffre d'Affaires",
      value: data ? `${(data.totalRevenusJour / 1000).toFixed(0)}K` : "0 FCFA",
      subtitle: "Total cumulé",
      icon: Wallet,
      bg: "bg-emerald-100",
      color: "text-emerald-700",
      trend: "+8%",
      up: true,
    },
    {
      title: "Paiements Reçus",
      value: data ? String(data.totalPaiements || 0) : "0 FCFA",
      subtitle: `${(data?.totalPaiements || 0).toLocaleString('fr-FR')} FCFA`,
      icon: FileCheck,
      bg: "bg-yellow-100",
      color: "text-yellow-700",
      trend: "+5%",
      up: true,
    },
    {
      title: "Satisfaction Client",
      value: data ? `${data.satisfactionMoyenne || 0}/5` : "0/5",
      subtitle: `${data?.qualityScore || 0}% de qualité`,
      icon: Star,
      bg: "bg-purple-100",
      color: "text-purple-700",
      trend: "-2%",
      up: false,
    },
  ];

  const alerts = [];
  if (data?.missingImages) alerts.push({ icon: ImageOff, text: "Images manquantes", color: "bg-red-50 text-red-600" });
  if (data?.missingRooms) alerts.push({ icon: Hourglass, text: "Chambres non créées", color: "bg-orange-50 text-orange-600" });
  if (data?.missing3DVisit) alerts.push({ icon: Video, text: "Visite 3D manquante", color: "bg-yellow-50 text-yellow-600" });

  return (
    <motion.div className="space-y-8 p-1" variants={containerVariants} initial="hidden" animate="visible">
      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0B1E3A]">
            Bienvenue, {user?.nom}
          </h1>
          <p className="text-slate-500 text-sm mt-2">Gestion complète de vos établissements hôteliers</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/manager/hotels/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Nouvel Hôtel
          </Link>
        </div>
      </motion.div>

      {/* ALERTES */}
      {alerts.length > 0 && (
        <motion.div variants={itemVariants} className="grid gap-3 md:grid-cols-3">
          {alerts.map((alert, idx) => {
            const Icon = alert.icon;
            return (
              <div key={idx} className={`${alert.color} border border-current border-opacity-20 rounded-xl p-4 flex items-start gap-3`}>
                <Icon size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{alert.text}</p>
                  <p className="text-xs opacity-75 mt-1">Complétez votre profil pour plus de visibilité</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* KPI GRID */}
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? "text-emerald-600" : "text-red-600"}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-black text-[#0B1E3A] mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-2">{stat.subtitle}</p>
            </div>
          );
        })}
      </motion.div>

      {/* SECTION MES HÔTELS */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#0B1E3A] flex items-center gap-2">
            <HotelIcon size={28} className="text-indigo-600" />
            Mes Établissements
          </h2>
          <Link to="/manager/hotels" className="text-sm font-bold text-blue-600 hover:underline">
            Voir tout
          </Link>
        </div>

        {hotels.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <HotelIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-bold">Aucun hôtel créé pour le moment</p>
            <p className="text-xs text-slate-400 mt-1">Commencez par ajouter votre premier établissement</p>
            <Link
              to="/manager/hotels/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
            >
              <Plus size={16} />
              Créer un hôtel
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCardDashboard key={hotel.idHotel} hotel={hotel} />
            ))}
          </div>
        )}
      </motion.div>

      {/* OPÉRATIONS */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-[#0B1E3A] mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" />
          Performance Opérationnelle
        </h3>
        {data && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <QualityItem
            label="Flux Caisse"
            value={String(data.totalRevenusJour ?? 0)}
            subtitle="Transactions"
            icon={TrendingUp}
            bg="bg-orange-50"
            color="text-orange-600"
          />
          <QualityItem
            label="Confirmations"
            value={String(data.reservationsConfirmees?.length ?? 0)}
            subtitle="Validées"
            icon={CheckCircle2}
            bg="bg-green-50"
            color="text-green-600"
          />
          <QualityItem
            label="En attente"
            value={String(data.reservationsEnAttente?.length ?? 0)}
            subtitle="Action requise"
            icon={Hourglass}
            bg="bg-pink-50"
            color="text-pink-600"
          />
          <QualityItem
            label="Annulations"
            value={String(0)}
            subtitle="Taux de perte"
            icon={AlertTriangle}
            bg="bg-slate-50"
            color="text-slate-600"
          />
        </div>
        )}
      </motion.div>

      {/* ACTIONS RAPIDES */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ActionLink to="/manager/hotels" icon={HotelIcon} label="Mes Hôtels" color="bg-indigo-50 text-indigo-600" />
        <ActionLink to="/manager/reservations" icon={CalendarCheck} label="Réservations" color="bg-emerald-50 text-emerald-600" />
        <ActionLink to="/manager/support" icon={Headphones} label="Support" color="bg-rose-50 text-rose-600" />
        <ActionLink to="/manager/profile" icon={Users} label="Mon Profil" color="bg-blue-50 text-blue-600" />
      </motion.div>

      {/* TABLEAU DES RÉSERVATIONS */}
      {data?.reservationsEnAttente && data.reservationsEnAttente.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#0B1E3A]">Dernières réservations en attente</h3>
            <Link to="/manager/reservations" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition">
              Voir tout les reservations →
            </Link>
          </div>

          {/* MOBILE: CARTES */}
          <div className="md:hidden grid gap-4">
            {data.reservationsEnAttente.slice(0, 5).map((res) => (
              <div
                key={res.idReservation}
                className="border border-slate-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 font-bold mb-1">HÔTEL</p>
                    <p className="font-bold text-[#0B1E3A] text-sm">{res.hotel?.nom || res.chambre?.hotel?.nom || "N/A"}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                    {res.montantTotal.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                   {res.client?.nom} {res.client?.prenom}
                </p>
                <p className="text-xs text-slate-500 mb-4">
                   {new Date(res.dateArrivee).toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  })} → {new Date(res.dateDepart).toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <Link
                  to={`/manager/reservations/${res.idReservation}`}
                  className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-indigo-700 transition flex items-center justify-center gap-1"
                >
                  Traiter <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          {/* DESKTOP: TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-4 font-bold">Hôtel</th>
                  <th className="pb-4 font-bold">Client</th>
                  <th className="pb-4 font-bold">Période</th>
                  <th className="pb-4 font-bold">Montant</th>
                  <th className="pb-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.reservationsEnAttente.slice(0, 5).map((res) => (
                  <tr
                    key={res.idReservation}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                  >
                    <td className="py-4 font-bold text-[#0B1E3A]">
                      {res.hotel?.nom || res.chambre?.hotel?.nom || "N/A"}
                    </td>
                    <td className="py-4 text-slate-700 font-medium text-sm">
                      {res.client?.nom} {res.client?.prenom}
                    </td>
                    <td className="py-4 text-slate-600 text-sm">
                      {new Date(res.dateArrivee).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      →{" "}
                      {new Date(res.dateDepart).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 font-black text-emerald-600">
                      {res.montantTotal.toLocaleString("fr-FR")}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/manager/reservations/${res.idReservation}`}
                        className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center justify-end gap-1 group"
                      >
                        Traiter{" "}
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// COMPOSANT CARTE HÔTEL DASHBOARD
interface HotelCardDashboardProps {
  hotel: Hotel;
}

function HotelCardDashboard({ hotel }: HotelCardDashboardProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = hotel.images || [];
  const roomCount = hotel._count?.chambres || 0;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const getStatus = () => {
    if (hotel.statut === "valider") return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Publié" };
    if (hotel.statut === "en_attente") return { bg: "bg-amber-50", text: "text-amber-700", label: "En attente" };
    return { bg: "bg-slate-100", text: "text-slate-600", label: "Brouillon" };
  };

  const status = getStatus();

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col h-full group">
      {/* IMAGE & CAROUSEL */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {images.length > 0 ? (
          <>
            <img
              src={`http://localhost:5000${images[currentImg]?.url}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={hotel.nom}
            />
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <button
                  onClick={prevSlide}
                  className="bg-white/90 p-1 rounded-full text-slate-800 shadow-md hover:bg-white transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white/90 p-1 rounded-full text-slate-800 shadow-md hover:bg-white transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            {/* COMPTEUR D'IMAGES */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-bold">
              {currentImg + 1}/{images.length}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <ImageOff size={32} strokeWidth={1} />
            <span className="text-xs font-bold uppercase mt-2">Pas d'image</span>
          </div>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-4 flex-grow flex flex-col gap-3">
        {/* TITRE ET STATUS */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-black text-slate-900 truncate text-sm">{hotel.nom}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin size={12} />
              {hotel.ville}
            </div>
          </div>
          <span className={`${status.bg} ${status.text} text-[10px] font-bold px-2 py-1 rounded-full shrink-0`}>
            {status.label}
          </span>
        </div>

        {/* PRIX ET CHAMBRES */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Tarif</p>
            <p className="text-sm font-black text-blue-700">{hotel.prixMin}K - {hotel.prixMax}K FCFA</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Chambres</p>
            <p className="text-sm font-black text-purple-700">{roomCount}/{hotel.nombreChambres}</p>
          </div>
        </div>

        {/* MÉTRIQUES */}
        <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-3">
          <div>
            <Layers size={14} className="mx-auto text-indigo-500 mb-1" />
            <p className="text-[10px] font-bold text-slate-600">{images.length} Photos</p>
          </div>
          <div>
            <Video size={14} className="mx-auto text-orange-500 mb-1" />
            <p className="text-[10px] font-bold text-slate-600">3D</p>
          </div>
          <div>
            <Star size={14} className="mx-auto text-yellow-500 mb-1" />
            <p className="text-[10px] font-bold text-slate-600">Avis</p>
          </div>
        </div>

        {/* ACTION */}
        <Link
          to={`/manager/hotels/${hotel.idHotel}/details`}
          className="w-full mt-auto px-3 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-bold text-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          Gérer <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

// COMPOSANT QUALITÉ
function QualityItem({ label, value, subtitle, icon: Icon, bg, color }: ActionCardProps) {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className={`${bg} rounded-2xl p-5 border border-white shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</p>
        <Icon size={16} className={color} />
      </div>
      <h4 className={`text-2xl font-black ${color}`}>{value}</h4>
      <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
    </motion.div>
  );
}

// COMPOSANT ACTION LINK
function ActionLink({ to, icon: Icon, label, color }: { to: string; icon: LucideIcon; label: string; color: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
      <Link
        to={to}
        className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </Link>
    </motion.div>
  );
}