import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type RecentBooking } from "../../interfaces/manager.interface";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Filter,
  Clock,
  CheckCircle2,
  Search,
  ChevronRight,
} from "lucide-react";
import { managerService } from "../../services/manager.service";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ReservationsListPage() {
  const [reservations, setReservations] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "montant">("date");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const data = await managerService.getPendingReservations();
        setReservations(data || []);
      } catch (error) {
        console.error("Erreur chargement réservations:", error);
        toast.error("Erreur lors du chargement des réservations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Filtrer et trier les réservations
  let filtered = reservations.filter((res) => {
    const matchFilter =
      filter === "all" ||
      (filter === "pending" && res.statut === "en_attente") ||
      (filter === "confirmed" && res.statut === "confirmée");

    const matchSearch =
      searchTerm === "" ||
      res.client?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.client?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.hotel?.nom || res.chambre?.hotel?.nom || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchFilter && matchSearch;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.dateArrivee).getTime() -
        new Date(a.dateArrivee).getTime()
      );
    }
    return b.montantTotal - a.montantTotal;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const totalRevenue = filtered.reduce((acc, res) => acc + res.montantTotal, 0);
  const pendingCount = filtered.filter((r) => r.statut === "en_attente").length;

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to="/manager"
            className="p-3 bg-white rounded-xl hover:bg-slate-50 transition shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#0B1E3A]">
              Registre des Réservations
            </h1>
            <p className="text-slate-500 mt-2">
              Gérez et confirmez les réservations de vos hôtels
            </p>
          </div>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-bold mb-1">Total</p>
                <p className="text-3xl font-black text-[#0B1E3A]">
                  {filtered.length}
                </p>
              </div>
              <Calendar className="text-indigo-600 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-bold mb-1">
                  En Attente
                </p>
                <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
              </div>
              <Clock className="text-amber-600 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-bold mb-1">Revenus</p>
                <p className="text-2xl font-black text-emerald-600">
                  {(totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-slate-400 mt-1">FCFA</p>
              </div>
              <DollarSign className="text-emerald-600 opacity-20" size={40} />
            </div>
          </div>
        </motion.div>

        {/* CONTROLS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom client ou hôtel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex gap-3 flex-wrap">
              {(["pending", "confirmed", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {f === "pending" && <Clock size={14} />}
                  {f === "confirmed" && <CheckCircle2 size={14} />}
                  {f === "all" && <Filter size={14} />}
                  {f === "pending"
                    ? "En attente"
                    : f === "confirmed"
                      ? "Confirmées"
                      : "Toutes"}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "montant")}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:border-indigo-400"
            >
              <option value="date">Trier par date (récent)</option>
              <option value="montant">Trier par montant (élevé)</option>
            </select>
          </div>
        </motion.div>

        {/* RESERVATIONS LIST */}
        {isLoading ? (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center h-96 gap-4 bg-white rounded-2xl"
          >
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Chargement des réservations...</p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-12 md:p-20 text-center border border-slate-100 shadow-sm"
          >
            <Calendar size={56} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              {searchTerm
                ? "Aucune réservation trouvée"
                : "Aucune réservation"}
            </h3>
            <p className="text-slate-500">
              {searchTerm
                ? `Essayez une autre recherche`
                : "Vous n'avez pas de réservation dans cette catégorie"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {/* DESKTOP VIEW - TABLE */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                        Hôtel & Chambre
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                        Période
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((res) => (
                      <tr
                        key={res.idReservation}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-[#0B1E3A]">
                              {res.hotel?.nom || res.chambre?.hotel?.nom || "N/A"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {res.chambre?.nom}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-700">
                              {res.client?.nom} {res.client?.prenom}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {res.client?.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(res.dateArrivee).toLocaleDateString(
                            "fr-FR",
                            { month: "short", day: "numeric" }
                          )}{" "}
                          →{" "}
                          {new Date(res.dateDepart).toLocaleDateString(
                            "fr-FR",
                            { month: "short", day: "numeric" }
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {Math.ceil(
                              (new Date(res.dateDepart).getTime() -
                                new Date(res.dateArrivee).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nuits
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-black text-emerald-600 text-lg">
                            {res.montantTotal.toLocaleString("fr-FR")}
                          </p>
                          <p className="text-xs text-slate-500">FCFA</p>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                              res.statut === "en_attente"
                                ? "bg-amber-100 text-amber-700"
                                : res.statut === "confirmée"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {res.statut === "en_attente" ? (
                              <Clock size={12} />
                            ) : (
                              <CheckCircle2 size={12} />
                            )}
                            {res.statut === "en_attente"
                              ? "En attente"
                              : res.statut === "confirmée"
                                ? "Confirmée"
                                : res.statut}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/manager/reservations/${res.idReservation}`}
                            className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                              res.statut === "en_attente"
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {res.statut === "en_attente" ? "Traiter" : "Voir"}
                            <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE VIEW - CARDS */}
            <div className="lg:hidden grid gap-4">
              {filtered.map((res) => (
                <motion.div
                  key={res.idReservation}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="font-bold text-[#0B1E3A] text-base">
                        {res.hotel?.nom || res.chambre?.hotel?.nom || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {res.chambre?.nom}
                      </p>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        res.statut === "en_attente"
                          ? "bg-amber-100 text-amber-700"
                          : res.statut === "confirmée"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {res.statut === "en_attente" ? (
                        <Clock size={10} />
                      ) : (
                        <CheckCircle2 size={10} />
                      )}
                      {res.statut === "en_attente" ? "Attente" : "OK"}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Client */}
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        CLIENT
                      </p>
                      <p className="font-bold text-sm text-slate-700">
                        {res.client?.nom}{" "}
                        {res.client?.prenom?.charAt(0)}.
                      </p>
                    </div>

                    {/* Montant */}
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        MONTANT
                      </p>
                      <p className="font-black text-sm text-emerald-600">
                        {(res.montantTotal / 1000).toFixed(1)}K FCFA
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        PÉRIODE
                      </p>
                      <p className="font-semibold text-sm text-slate-700">
                        {new Date(res.dateArrivee).toLocaleDateString(
                          "fr-FR",
                          { month: "short", day: "numeric" }
                        )}{" "}
                        →{" "}
                        {new Date(res.dateDepart).toLocaleDateString(
                          "fr-FR",
                          { month: "short", day: "numeric" }
                        )}{" "}
                        <span className="text-xs text-slate-500">
                          ({Math.ceil(
                            (new Date(res.dateDepart).getTime() -
                              new Date(res.dateArrivee).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          nuits)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/manager/reservations/${res.idReservation}`}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      res.statut === "en_attente"
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {res.statut === "en_attente" ? "Traiter" : "Voir"}
                    <ChevronRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
