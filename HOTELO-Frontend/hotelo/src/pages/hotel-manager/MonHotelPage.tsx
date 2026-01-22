import { Plus, MapPin, BedDouble, Edit, Eye } from "lucide-react";

const hotels = [
  {
    id: 1,
    name: "Hôtel La Falaise",
    city: "Douala",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rooms: 45,
    occupancy: "78%",
    status: "Actif",
  },
  {
    id: 2,
    name: "Hôtel Mont Fébé",
    city: "Yaoundé",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rooms: 32,
    occupancy: "62%",
    status: "Actif",
  },
];

export default function MesHotelsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Mes hôtels
          </h1>
          <p className="text-sm text-gray-500">
            Gérez vos établissements hôteliers
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3A] text-white hover:bg-[#0B1E3A]/90">
          <Plus size={18} />
          Ajouter un hôtel
        </button>
      </div>

      {/* Hotels grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
          >
            {/* Image */}
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-40 w-full object-cover"
            />

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  {hotel.city}
                </div>
              </div>

              {/* Info */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <BedDouble size={16} />
                  {hotel.rooms} chambres
                </div>

                <span className="text-gray-600">
                  Occupation :{" "}
                  <span className="font-medium text-gray-800">
                    {hotel.occupancy}
                  </span>
                </span>
              </div>

              {/* Status */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                {hotel.status}
              </span>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                  <Eye size={16} />
                  Voir
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                  <Edit size={16} />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
