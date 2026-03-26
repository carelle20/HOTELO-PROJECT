import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import HotelExperience3D from "../components/HotelDetails/HotelExperience3D";
import { type visite3DScene } from "../interfaces/manager.interface";

export default function Room3DExperience() {
  const navigate = useNavigate();
  
  // Données de visite 3D pour les chambres - À adapter avec vos vraies images 360
  const room3DScenes: visite3DScene[] = [
    {
      identifiant: "room_main_view",
      nom: "Vue générale",
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200",
      points: [
        {
          label: "Salle de bain",
          positionX: 100,
          positionY: 50,
          positionZ: 200,
          versScene: "room_bathroom"
        },
        {
          label: "Vue du balcon",
          positionX: -150,
          positionY: 0,
          positionZ: 150,
          versScene: "room_balcony"
        }
      ]
    },
    {
      identifiant: "room_bathroom",
      nom: "Salle de bain",
      imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200",
      points: [
        {
          label: "Retour à la chambre",
          positionX: -100,
          positionY: 20,
          positionZ: 180,
          versScene: "room_main_view"
        }
      ]
    },
    {
      identifiant: "room_balcony",
      nom: "Balcon / Vue",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200",
      points: [
        {
          label: "Retour à la chambre",
          positionX: 100,
          positionY: 50,
          positionZ: 200,
          versScene: "room_main_view"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={22} />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center gap-2 text-white">
            <MapPin size={18} />
            <span className="font-semibold">Visite 3D - Chambre</span>
          </div>

          <div />
        </div>
      </div>

      {/* Expérience 3D */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-7xl mx-auto p-4">
          <HotelExperience3D data={room3DScenes} />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black/40 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-300">
          <p>💡 Utilisez votre souris pour tourner • Scrollez pour zoomer • Cliquez sur les points pour explorer</p>
        </div>
      </div>
    </div>
  );
}
