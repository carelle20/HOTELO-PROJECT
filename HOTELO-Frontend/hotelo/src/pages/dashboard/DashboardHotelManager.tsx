import { motion } from "framer-motion";
import { Hotel, PlusCircle, CalendarClock, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/useAuth";


export default function DashboardHotel() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md p-8"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Bienvenue, {user?.nom}
          </h1>
          <p className="text-slate-600">
            Gérez votre établissement et suivez vos performances depuis cet espace.
          </p>
        </motion.div>

        {/* Statut du compte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
        >
          <AlertCircle className="text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800">
              Compte non vérifié
            </h3>
            <p className="text-sm text-yellow-700">
              Votre compte est actif mais votre hôtel n’est pas encore vérifié.
              Vous pourrez publier après validation.
            </p>
          </div>
        </motion.div>

        {/* Actions principales */}
        <div className="grid gap-8 md:grid-cols-3">

          {/* Enregistrer un hôtel */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-lg p-6 border"
          >
            <div className="w-12 h-12 mb-4 rounded-xl bg-[#0B1E3A] text-yellow-400 flex items-center justify-center">
              <PlusCircle />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              <a
                href="/dashboard/hotels/create"
                className="inline-block bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg font-semibold"
              >
                Enregistrer un hôtel
              </a>
            </h3>
            <p className="text-sm text-slate-600">
              Ajoutez un nouvel établissement et commencez à recevoir des réservations.
            </p>
          </motion.div>

          {/* Gérer les hôtels */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-lg p-6 border"
          >
            <div className="w-12 h-12 mb-4 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center">
              <Hotel />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              <a
                href="dashboard/hotels"
                className="inline-block bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg font-semibold"
              >
                Mes hôtels
              </a>
            </h3>
            <p className="text-sm text-slate-600">
              Consultez, modifiez et mettez à jour vos hôtels.
            </p>
          </motion.div>

          {/* Réservations */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-lg p-6 border"
          >
            <div className="w-12 h-12 mb-4 rounded-xl bg-slate-700 text-yellow-400 flex items-center justify-center">
              <CalendarClock />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Réservations
            </h3>
            <p className="text-sm text-slate-600">
              Suivez les réservations et l’occupation de vos chambres.
            </p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
