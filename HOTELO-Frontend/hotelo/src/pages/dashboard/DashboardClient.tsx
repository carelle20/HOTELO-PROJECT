export default function DashboardClient() {
  return (
    <section className="p-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Bienvenue sur HOTELO 
      </h1>

      <p className="text-slate-600 mb-8">
        Retrouvez vos réservations et découvrez de nouveaux hôtels.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold text-lg mb-2">
            Réservations à venir
          </h3>
          <p className="text-slate-500 text-sm">
            Aucune réservation pour le moment.
          </p>
        </div>

        <div className="bg-[#0B1E3A] text-yellow-400 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-2">
            Explorer les hôtels
          </h3>
          <p className="text-sm mb-4">
            Trouvez l’hôtel idéal pour votre prochain séjour.
          </p>

          <a
            href="/discover"
            className="inline-block bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg font-semibold"
          >
            Découvrir
          </a>
        </div>
      </div>
    </section>
  );
}
