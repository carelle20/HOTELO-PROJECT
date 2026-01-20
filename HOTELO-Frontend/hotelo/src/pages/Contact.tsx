import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquareText,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function Contact() {
  return (
    <main className="bg-slate-50">

      {/* HERO */}
      <section className=" py-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-yellow-400 text-[#0B1E3A] flex items-center justify-center">
              <MessageSquareText size={28} />
            </div>
          </div>

          <h1 className="text-3xl md:text-3xl font-bold text-slate-900 mb-4">
            Contactez-nous
          </h1>

          <p className="text-slate-600 text-lg">
            Une question, une suggestion ou un besoin d’assistance ?
            Notre équipe est à votre écoute.
          </p>
        </motion.div>
      </section>

      {/* CONTENU */}
      <section className="py-4 px-6 text-center lg:text-left">
        <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-2 text-center">

          {/* INFOS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Nos coordonnées
            </h2>

            <p className="text-slate-600 mb-10">
              Vous pouvez nous contacter directement ou utiliser le formulaire.
              Nous répondons généralement sous 24 heures.
            </p>

            <div className="space-y-6">

              {/* Email */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-yellow-500 text-slate-900 flex items-center justify-center">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Email</p>
                  <p className="text-slate-600">info@digitalgenerationacademy.com</p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-yellow-500 text-slate-900 flex items-center justify-center">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Téléphone</p>
                  <p className="text-slate-600">+237 651 36 98 77</p>
                </div>
              </div>

              {/* Localisation */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-yellow-500 text-slate-900 flex items-center justify-center">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Localisation</p>
                  <p className="text-slate-600">Yaoundé,Cameroun</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* FORMULAIRE */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Envoyer un message
            </h2>

            <div className="grid gap-6">
              {/* Nom */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2a9d90]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Votre email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2a9d90]"
                />
              </div>

              {/* Sujet */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Sujet
                </label>
                <input
                  type="text"
                  placeholder="Sujet"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2a9d90]"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  placeholder="Votre message"
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2a9d90] resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 text-slate-900 px-6 py-3 font-semibold hover:bg-slate-800 hover:text-white transition"
              >
                Envoyer le message
                <Send size={18} />
              </button>
            </div>
          </motion.form>

        </div>
      </section>

      {/* CONFIANCE */}
      <section className="py-16 ">
        <div className="max-w-5xl mx-auto px-6 grid gap-8 sm:grid-cols-3 text-center">

          <div className="flex flex-col items-center gap-3">
            <Clock className="text-yellow-400" />
            <p className="font-bold text-slate-900">Réponse rapide</p>
            <p className="text-sm text-slate-600">Réaction sous 24h</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="text-yellow-400" />
            <p className="font-bold text-slate-900">Données sécurisées</p>
            <p className="text-sm text-slate-600">Vos informations sont protégées</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <MessageSquareText className="text-yellow-400" />
            <p className="font-bold text-slate-900">Support humain</p>
            <p className="text-sm text-slate-600">Assistance dédiée</p>
          </div>

        </div>
      </section>

    </main>
  );
}