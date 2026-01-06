import { motion } from "framer-motion";
import {
  Compass,
  User,
  Hotel,
  Search,
  CreditCard,
  MessageSquarePlus,
  MessageSquareQuote,
  ScanEye,
  CalendarClock,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Icône + Titre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          {/* Icône */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900">
              <Compass size={28} />
            </div>
          </div>

          <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-4">
            Comment ça marche
          </h2>

          <p className="text-lg text-gray-700">
            Grace a nos interfaces simples et intuitives, publier votre hôtel ou 
            réserver une chambre en quelques clics.
          </p>
        </motion.div>

        {/* Cartes */}
        <div className="grid gap-12 md:grid-cols-2">

          {/* CLIENTS */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center">
                <User size={22} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Pour les clients
              </h3>
            </div>

            <p className="text-gray-700 mb-8">
              Découvrez et réservez facilement des hôtels adaptés à vos besoins.
            </p>

            {/* Étapes */}
            <ul className="space-y-6 mb-10">
              {[
                {
                  title: "Rechercher un hôtel",
                  desc: "Parcourez les hôtels disponibles selon vos critères.",
                  icon: Search,
                },
                {
                  title: "Consultez les chambres disponibles",
                  desc: "Faites votre choix parmi les chambres disponibles selon vos preferences.",
                  icon: ScanEye,
                },
                {
                  title: "Réserver en ligne",
                  desc: "Choisissez votre chambre et confirmez votre séjour.",
                  icon: CreditCard,
                },
                {
                  title: "Laissez un avis",
                  desc: "Evaluez la qualite du sejour pour une meilleure experience.",
                  icon: MessageSquarePlus,
                },
              ].map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={index} className="flex items-start gap-4">
                    {/* Numéro animé */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-9 h-9 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-sm"
                    >
                      {`0${index + 1}`}
                    </motion.div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {step.desc}
                      </p>
                    </div>

                    <Icon className="text-yellow-500" />
                  </li>
                );
              })}
            </ul>

            <Link
              to="/decouvrir"
              className="inline-block w-full text-center rounded-xl bg-slate-900 text-yellow-500 py-3 font-semibold hover:bg-slate-700 transition"
            >
              Découvrir les hôtels →
            </Link>
          </motion.div>

          {/* RESPONSABLES */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center">
                <Hotel size={22} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Pour les responsables d’hôtels
              </h3>
            </div>

            <p className="text-gray-700 mb-8">
              Gérez et développez votre établissement grâce à une solution moderne.
            </p>

            {/* Étapes */}
            <ul className="space-y-6 mb-10">
              {[
                {
                  title: "Enregistrer votre hôtel",
                  desc: "Ajoutez les informations de l'etablissement, photos et chambres disponibles.",
                  icon: Hotel,
                },
                {
                  title: "Gérer le calendrier",
                  desc: "Mettez à jour vos tarifs et vos disponibilités en temps réel.",
                  icon: CalendarClock,
                },
                {
                  title: "Suivre les réservations",
                  desc: "Analysez vos performances depuis le tableau de bord.",
                  icon: LayoutDashboard,
                },
                {
                  title: "Interagir avec les clients",
                  desc: "Répondez aux avis et messages pour améliorer votre image.",
                  icon: MessageSquareQuote,
                },
              ].map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={index} className="flex items-start gap-4">
                    {/* Numéro animé */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-9 h-9 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-sm"
                    >
                      {`0${index + 1}`}
                    </motion.div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {step.desc}
                      </p>
                    </div>

                    <Icon className="text-yellow-500" />
                  </li>
                );
              })}
            </ul>

            <Link
              to="/connexion"
              className="inline-block w-full text-center rounded-xl bg-slate-900 text-yellow-500 py-3 font-semibold hover:bg-slate-700 transition"
            >
              Enregistrer votre hôtel →
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Contact / Support */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="mt-14 sm:mt-20 flex justify-center px-4"
      >
        <div className="
          w-full
          max-w-4xl
          bg-white
          border border-slate-200
          rounded-2xl
          p-6 sm:p-8 md:p-10
          shadow-sm
          flex flex-col md:flex-row
          items-center
          gap-6 md:gap-10
        ">

          {/* Texte */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-yellow-500 text-slate-900 flex items-center justify-center shrink-0">
              <MessageSquareQuote size={20} />
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                Une question ou une préoccupation ?
              </h4>
              <p className="text-sm sm:text-base text-gray-700 max-w-md">
                Notre équipe est disponible pour vous accompagner et répondre
                à toutes vos questions concernant l’utilisation de la plateforme.
              </p>
            </div>
          </div>

          {/* Bouton */}
          <Link
            to="/contact"
            className="
              w-full sm:w-auto
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-yellow-500
              text-white
              px-6
              py-3
              font-semibold
              hover:bg-slate-700
              transition
              whitespace-nowrap
            "
          >
            Contacter le support 
          </Link>

        </div>
      </motion.div>

    </section>
  );
}
