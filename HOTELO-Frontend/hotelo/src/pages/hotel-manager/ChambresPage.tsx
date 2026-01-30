import {
  Users,
  Image,
  Edit,
  Eye,
  Plus,
} from "lucide-react";

const rooms = [
  {
    id: 1,
    name: "Chambre Deluxe",
    type: "Double",
    price: 45000,
    capacity: 2,
    status: "Disponible",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
  },
  {
    id: 2,
    name: "Suite Présidentielle",
    type: "Suite",
    price: 120000,
    capacity: 4,
    status: "Occupée",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
];

export default function ChambresPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chambres
          </h1>
          <p className="text-sm text-gray-500">
            Gérez les chambres et leurs images
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3A] text-white hover:bg-[#0B1E3A]/90">
          <Plus size={18} />
          Ajouter une chambre
        </button>
      </div>

      {/* Rooms grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={room.image}
                alt={room.name}
                className="h-40 w-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                {room.type}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {room.name}
              </h3>

              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {room.capacity} pers.
                </div>

                <div className="font-semibold text-[#0B1E3A]">
                  {room.price.toLocaleString()} FCFA / nuit
                </div>
              </div>

              {/* Status */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  room.status === "Disponible"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {room.status}
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

                <button className="flex items-center justify-center px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Image size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
