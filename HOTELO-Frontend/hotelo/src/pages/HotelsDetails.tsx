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
            ville={hotel.ville} 
            prixMin={hotel.prix}
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
      <HotelExperience3D url={hotel.visite3D} />
    </main>
  );
}
