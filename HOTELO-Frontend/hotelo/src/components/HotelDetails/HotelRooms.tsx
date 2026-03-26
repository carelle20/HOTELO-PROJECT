import { BedDouble, Users, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string | number;
  idChambre?: string | number;
  nom: string;
  capacite: number;
  prix: number;
  description?: string;
}

export default function HotelRooms({ rooms }: { rooms: Room[] }) {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-10">
          Chambres disponibles
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {room.nom}
              </h3>
              
              {room.description && (
                <p className="text-sm text-slate-500 mb-4">{room.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-slate-700 mb-6">
                <span className="flex items-center gap-1">
                  <Users size={16} className="text-blue-500"/> {room.capacite} personnes
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble size={16} className="text-blue-500"/> Lit confortable
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xl font-bold text-slate-900">
                  {room.prix.toLocaleString()} FCFA
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/chambre/3d/${room.idChambre || room.id}`)}
                    className="px-3 py-2 cursor-pointer rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition text-sm font-medium flex items-center gap-1"
                    title="Visite 3D de la chambre"
                  >
                    <Eye size={16} />
                    3D
                  </button>
                  <button
                    onClick={() => navigate(`/reserver/${room.idChambre || room.id}`)}
                    className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                  >                 
                    Réserver
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
