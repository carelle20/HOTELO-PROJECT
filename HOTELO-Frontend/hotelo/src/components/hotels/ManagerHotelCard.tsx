import type { Hotel } from "../../data/hotels.manager.mock";
import { Link } from "react-router-dom";

interface Props {
  hotel: Hotel;
}

export default function ManagerHotelCard({ hotel }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md border p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-[#0B1E3A]">
          {hotel.name}
        </h3>
        <p className="text-sm text-slate-500">{hotel.city}</p>

        <p className="text-sm text-slate-600 mt-3 line-clamp-3">
          {hotel.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {hotel.amenities.map((a) => (
            <span
              key={a}
              className="text-xs bg-slate-100 px-3 py-1 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/dashboard/hotels/${hotel.id}`}
          className="flex-1 text-center rounded-xl bg-[#0B1E3A] text-yellow-400 py-2 font-semibold"
        >
          Gérer
        </Link>

        <button
          disabled
          className="flex-1 rounded-xl bg-slate-200 text-slate-500 py-2 font-semibold cursor-not-allowed"
        >
          Statistiques
        </button>
      </div>
    </div>
  );
}
