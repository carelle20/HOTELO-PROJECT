import { BedDouble, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string | number;
  nom: string;
  capacite: number;
  prix: number;
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
              className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {room.nom}
              </h3>

              <div className="flex items-center gap-4 text-sm text-slate-700 mb-4">
                <span className="flex items-center gap-1 ">
                  <Users size={16} className="text-yellow-500"/> {room.capacite} personnes
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble size={16} className="text-yellow-500"/> Lit confortable
                </span>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-xl font-bold text-slate-900">
                  {room.prix.toLocaleString()} FCFA
                </span>
                  
                <button
                  onClick={() => navigate(`/reserver/${room.id}`)}
                  className="px-4 py-2 cursor-pointer rounded-xl bg-slate-900 text-yellow-500 hover:bg-slate-700 transition "
                >                 
                  Réserver
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
