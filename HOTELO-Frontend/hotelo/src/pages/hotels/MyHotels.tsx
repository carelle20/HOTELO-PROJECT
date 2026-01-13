import { managerHotels } from "../../data/hotels.manager.mock";
import { useAuth } from "../../context/useAuth";
import ManagerHotelCard from "../../components/hotels/ManagerHotelCard";
import { Link } from "react-router-dom";

export default function MyHotels() {
  const { user } = useAuth();

  if (!user) return null;

  const myHotels = managerHotels.filter(
    (hotel) => hotel.ownerId === user.id
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes hôtels</h1>
          <p className="text-slate-500">
            Gérez les établissements que vous avez enregistrés
          </p>
        </div>

        <Link
          to="/dashboard/hotels/create"
          className="bg-yellow-400 px-5 py-3 rounded-xl font-bold text-[#0B1E3A]"
        >
          + Ajouter un hôtel
        </Link>
      </div>

      {myHotels.length === 0 ? (
        <div className="bg-slate-50 border rounded-2xl p-10 text-center">
          <p className="text-slate-600 mb-4">
            Vous n’avez encore enregistré aucun hôtel.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myHotels.map((hotel) => (
            <ManagerHotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
