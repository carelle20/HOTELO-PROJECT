import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useHotelDetails } from "../hooks";
import HotelAmenitiesSection from "../components/HotelDetails/HotelAmenitiesSection";
import {
  MapPin,
  ArrowLeft,
  Users,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Navigation,
  Heart,
  Eye,
} from "lucide-react";
import type { Chambre } from "../interfaces/client.interface";
import HotelGallerySection from "../components/HotelDetails/HotelGallerySection";

const ChambreCard = ({ chambre }: { chambre: Chambre }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();
  const images = chambre.images || [];
  const url = "http://localhost:5000";

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row gap-6 p-4 hover:shadow-md transition-shadow">
      <div className="w-full md:w-72 h-48 relative group flex-shrink-0">
        {images.length > 0 ? (
          <>
            <img
              src={`${url}${images[activeImageIndex].url}`}
              className="w-full h-full object-cover rounded-xl transition-opacity duration-300"
              alt={`${chambre.nom}`}
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === activeImageIndex ? "bg-white w-3" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white text-gray-800"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white text-gray-800"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-gray-400" size={40} />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-[#0B1E3A]">{chambre.nom}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                chambre.statut === "disponible"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {chambre.statut}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 italic">
            {chambre.description}
          </p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <Users size={18} className="mr-2 text-blue-500" /> {chambre.capacite}{" "}
              Personnes
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <div>
            <span className="text-2xl font-black text-[#0B1E3A]">
              {chambre.prix.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm font-semibold ml-1 underline decoration-[#F4B400]">
              FCFA / nuit
            </span>
          </div>
          <button 
            onClick={() => navigate(`/reserver/${chambre.idChambre}`)}
            className="bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition cursor-pointer"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HotelsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotelId = id ? Number(id) : 0;
  const { hotel, loading, error } = useHotelDetails(hotelId);
  const url = "http://localhost:5000";

  if (!hotelId) {
    return (
      <div className="py-32 text-center text-slate-600">
        ID d'hôtel invalide
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-600">
        Chargement des détails de l'hôtel...
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="py-32 text-center">
        <p className="text-red-600 mb-4">{error || "Hôtel non trouvé"}</p>
        <button
          onClick={() => navigate("/discover")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const formattedImages = hotel.images.map(img => ({
    ...img,
    url: img.url.startsWith('http') ? img.url : `${url}${img.url}`
  }));
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/discover")}
          className="flex items-center text-gray-500 hover:text-[#0B1E3A] transition font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Retour à la liste
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/hotels/${hotelId}/visite-3d`)}
            className="bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition shadow-sm font-semibold text-blue-600 cursor-pointer"
          >
            <Eye size={18} /> Visite 3D
          </button>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition shadow-sm font-semibold text-[#0B1E3A] cursor-pointer">
            <Heart size={18} /> Ajouter aux favoris
          </button>
        </div>
      </div>

      {/* Galerie Principale */}
      {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[450px]">
        <div className="relative rounded-3xl overflow-hidden group shadow-lg">
          {imagePrincipale ? (
            <>
              <img
                src={`${url}${imagePrincipale}`}
                className="w-full h-full object-cover transition transform group-hover:scale-105 duration-700"
                alt={hotel.nom}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="text-gray-400" size={48} />
            </div>
          )}
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-black mb-2">{hotel.nom}</h1>
            <p className="flex items-center opacity-90 text-lg">
              <MapPin size={20} className="mr-2 text-[#F4B400]" />{" "}
              {hotel.adresse || hotel.ville}, {hotel.pays}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {hotel.images
            .filter((img) => !img.estPrincipale)
            .slice(0, 4)
            .map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden shadow-md group">
                <img
                  src={`${url}${img.url}`}
                  className="w-full h-full object-cover group-hover:opacity-90 transition cursor-pointer"
                  alt="Galerie"
                />
              </div>
            ))}
        </div>
      </section> */}
      <HotelGallerySection 
        images={formattedImages} 
        hotelName={hotel.nom} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0B1E3A] mb-4">
              À propos de cet hôtel
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {hotel.description}
            </p>
          </div>

          {/* Équipements et Services */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotel.equipements && hotel.equipements.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-[#0B1E3A] text-lg">
                  <Wifi size={22} className="text-blue-500" /> Équipements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.equipements.map((eq, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100"
                    >
                      {eq.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hotel.services && hotel.services.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-[#0B1E3A] text-lg">
                  <Coffee size={22} className="text-amber-500" /> Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.services.map((ser, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100"
                    >
                      {ser.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div> */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <HotelAmenitiesSection 
              equipements={hotel.equipements} 
              services={hotel.services} 
            />
          </div>

          {/* Chambres */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#0B1E3A]">
                Chambres disponibles
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {hotel.chambres && hotel.chambres.length > 0 ? (
                hotel.chambres.map((chambre) => (
                  <ChambreCard key={chambre.idChambre} chambre={chambre} />
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <BedDouble
                    className="mx-auto text-gray-300 mb-4"
                    size={48}
                  />
                  <p className="text-gray-500 font-medium">
                    Aucune chambre disponible.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Localisation et Résumé */}
        <div className="space-y-6">
          {/* Carte */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-lg text-[#0B1E3A] flex items-center gap-2">
              <MapPin className="text-red-500" /> Localisation
            </h3>
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-100">
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100 transition"
            >
              <Navigation size={18} /> Obtenir l'itinéraire
            </a>
          </div>

          {/* Résumé */}
          <div className="bg-[#0B1E3A] p-8 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold text-xl mb-6 border-b border-white/10 pb-4 text-[#F4B400]">
              Résumé
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Total Chambres</span>
                <span className="text-2xl font-bold">
                  {hotel.chambres?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Ville</span>
                <span className="font-bold">{hotel.ville}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Prix/Nuit</span>
                <span className="font-bold text-[#F4B400]">
                  {hotel.prixMin?.toLocaleString()} -{" "}
                  {hotel.prixMax?.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
