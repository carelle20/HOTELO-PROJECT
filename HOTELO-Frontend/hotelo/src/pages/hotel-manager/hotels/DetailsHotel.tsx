import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Plus, Edit, ArrowLeft, Wifi, Coffee, 
  Users, Image as ImageIcon, ChevronLeft, ChevronRight, BedDouble, Navigation 
} from 'lucide-react';
import { managerService } from '../../../services/manager.service';
import { toast } from 'react-hot-toast';
import type { ChambreData } from '@/src/interfaces/manager.interface';
import HotelExperience3D from '../../../components/HotelDetails/HotelExperience3D';

// Mise à jour de l'interface pour inclure la 3D et les coordonnées
interface HotelData {
  idHotel: number;
  nom: string;
  description: string;
  ville: string;
  pays: string;
  adresse: string;
  latitude: number; 
  longitude: number;
  images: { url: string; estPrincipale: boolean }[];
  equipements: { equipement: { nom: string } }[];
  services: { service: { nom: string } }[];
  chambres: ChambreData[];
  visite3D: {
    identifiant: string;
    nom: string;
    image360Url: string;
    points: {
      label: string;
      versScene: string;
      positionX: number;
      positionY: number;
      positionZ: number;
    }[];
  }[];
}

const ChambreCard = ({ chambre }: { chambre: ChambreData }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:row gap-6 p-4 hover:shadow-md transition-shadow">
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
                  <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-1.5 h-1.5 rounded-full ${idx === activeImageIndex ? "bg-white w-3" : "bg-white/50"}`} />
                ))}
              </div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white text-gray-800"><ChevronLeft size={16} /></button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white text-gray-800"><ChevronRight size={16} /></button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl"><ImageIcon className="text-gray-400" size={40} /></div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-[#0B1E3A]">{chambre.nom}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${chambre.statut === "disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{chambre.statut}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 italic">{chambre.description}</p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center text-gray-700 text-sm font-medium"><Users size={18} className="mr-2 text-blue-500" /> {chambre.capacite} Pers.</div>
            <div className="flex items-center text-gray-700 text-sm font-medium"><BedDouble size={18} className="mr-2 text-blue-500" /> Standard</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <div><span className="text-2xl font-black text-[#0B1E3A]">{chambre.prix.toLocaleString()}</span><span className="text-gray-400 text-sm font-semibold ml-1 underline decoration-[#F4B400]">FCFA / nuit</span></div>
          <button className="text-gray-400 hover:text-blue-600 transition"><Edit size={18} /></button>
        </div>
      </div>
    </div>
  );
};

const HotelDetails: React.FC = () => {
  const { idHotel } = useParams<{ idHotel: string }>();
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:5000";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!idHotel) return;
        const response = await managerService.getHotelById(idHotel);
        setHotel(response.data || response); 
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'hôtel :", error);
        toast.error("Erreur lors de la récupération des détails");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [idHotel]);

  if (loading) return <div className="p-10 text-center font-medium text-gray-500">Chargement...</div>;
  if (!hotel) return <div className="p-10 text-center text-red-500 font-bold">Hôtel introuvable</div>;

  const imagePrincipale = hotel.images.find(img => img.estPrincipale)?.url || hotel.images[0]?.url;

  // Préparation des données pour le composant 3D
  const scenes3D = hotel.visite3D?.map(s => ({
    identifiant: s.identifiant,
    nom: s.nom,
    image360Url: `${url}${s.image360Url}`,
    points: s.points?.map(p => ({ label: p.label, versScene: p.versScene, positionX: p.positionX, positionY: p.positionY, positionZ: p.positionZ })) || []
  })) || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link to="/manager/hotels" className="flex items-center text-gray-500 hover:text-[#0B1E3A] transition font-medium">
          <ArrowLeft size={20} className="mr-2" /> Retour à la liste
        </Link>
        <Link to={`/manager/hotels/edit/${idHotel}`} className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition shadow-sm font-semibold text-[#0B1E3A]">
          <Edit size={18} /> Modifier l'hôtel
        </Link>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[450px]">
        <div className="relative rounded-3xl overflow-hidden group shadow-lg">
          <img src={`${url}${imagePrincipale}`} className="w-full h-full object-cover transition transform group-hover:scale-105 duration-700" alt={hotel.nom} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-black mb-2">{hotel.nom}</h1>
            <p className="flex items-center opacity-90 text-lg"><MapPin size={20} className="mr-2 text-[#F4B400]" /> {hotel.adresse}, {hotel.ville}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {hotel.images.filter(img => !img.estPrincipale).slice(0, 4).map((img, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden shadow-md group">
              <img src={`${url}${img.url}`} className="w-full h-full object-cover group-hover:opacity-90 transition cursor-pointer" alt="Galerie" />
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0B1E3A] mb-4">À propos de cet hôtel</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{hotel.description}</p>
          </div>

          {/* SECTION VISITE 3D INTERACTIVE */}
          {scenes3D.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-[#0B1E3A] flex items-center gap-2">
                <ImageIcon className="text-blue-500" /> Visite Virtuelle 360°
              </h2>
              <div className="shadow-2xl rounded-3xl overflow-hidden border-4 border-white">
                <HotelExperience3D data={scenes3D} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-[#0B1E3A] text-lg"><Wifi size={22} className="text-blue-500" /> Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.equipements?.map((eq, i) => (
                  <span key={i} className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">{eq.equipement.nom}</span>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-[#0B1E3A] text-lg"><Coffee size={22} className="text-amber-500" /> Services</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.services?.map((ser, i) => (
                  <span key={i} className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">{ser.service.nom}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#0B1E3A]">Chambres disponibles</h2>
              <Link to={`/manager/hotels/${idHotel}/chambres/create`} className="flex items-center gap-2 bg-[#0B1E3A] text-white px-6 py-3 rounded-xl hover:bg-[#162d4d] transition shadow-md font-bold">
                <Plus size={20} /> Ajouter une chambre
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {hotel.chambres?.length > 0 ? hotel.chambres.map((chambre) => <ChambreCard key={chambre.idChambre} chambre={chambre} />) : (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <BedDouble className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">Aucune chambre disponible.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* CARTE DE GÉOLOCALISATION */}
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

          <div className="bg-[#0B1E3A] p-8 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold text-xl mb-6 border-b border-white/10 pb-4 text-[#F4B400]">Résumé</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-white/60">Total Chambres</span><span className="text-2xl font-bold">{hotel.chambres?.length || 0}</span></div>
              <div className="flex justify-between items-center"><span className="text-white/60">Ville</span><span className="font-bold">{hotel.ville}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;