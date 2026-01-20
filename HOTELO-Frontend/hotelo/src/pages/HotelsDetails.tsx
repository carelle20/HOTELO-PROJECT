import { useParams } from "react-router-dom";
import { hotels } from "../data/hotels.mock";

import HotelGallery from "../components/HotelDetails/HotelGallery";
import HotelInfo from "../components/HotelDetails/HotelInfo";
import HotelAmenities from "../components/HotelDetails/HotelAmenities";
import HotelMap from "../components/HotelDetails/HotelMap";
import HotelRooms from "../components/HotelDetails/HotelRooms";
import HotelReviews from "../components/HotelDetails/HotelReviews";
import HotelExperience3D from "../components/HotelDetails/HotelExperience3D";

export default function HotelDetails() {
  const { id } = useParams();

  const hotel = hotels.find(h => h.id === Number(id));

  if (!hotel) {
    return (
      <div className="py-32 text-center text-slate-600">
        Hôtel introuvable
      </div>
    );
  }

  return (
    <main className="bg-slate-50">
      
      {/* Galerie + Infos */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-2">
          <HotelGallery images={hotel.images} />
          <HotelInfo 
            nom={hotel.nom} 
            description={hotel.description} 
            note={hotel.note} 
            adresse={hotel.adresse} 
            prixMin={hotel.prixMin}
            prixMax={hotel.prixMax}
          />
        </div>
      </section>

      {/* Équipements */}
      <HotelAmenities amenities={hotel.amenities} />

      {/* Carte */}
      <HotelMap
        latitude={hotel.latitude}
        longitude={hotel.longitude}
        nom={hotel.nom}
      />

      {/* Chambres */}
      <HotelRooms rooms={hotel.rooms} />

      {/* Avis */}
      <HotelReviews reviews={hotel.reviews} />
      
      {/* Experience 3D */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Visite Immersive</h1>
          <p className="text-slate-500">Explorez chaque recoin de votre future chambre avant même d'arriver.</p>
        </div>

        {/* Conteneur de la 3D */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2">
          <HotelExperience3D data={hotel.visite3D as unknown} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="block font-bold text-[#0B1E3A]">360°</span>
            <span className="text-xs text-slate-500">Liberté de mouvement</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="block font-bold text-[#0B1E3A]">Zoom</span>
            <span className="text-xs text-slate-500">Détails haute précision</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="block font-bold text-[#0B1E3A]">Réaliste</span>
            <span className="text-xs text-slate-500">Textures fidèles</span>
          </div>
        </div>
      </div>
    </main>
  );
}
