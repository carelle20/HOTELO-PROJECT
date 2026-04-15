import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Hotel as HotelIcon, 
  Wallet, 
  BedDouble, 
  ImageOff, 
  Edit3, 
  PlusCircle, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  AlignLeft
} from 'lucide-react';

interface HotelCardProps {
  hotel: {
    idHotel: number;
    nom: string;
    ville: string;
    adresse: string;
    description: string;
    statut?: string;
    prixMin: number;
    prixMax: number;
    images: { url: string; estPrincipale: boolean }[];
    _count?: { chambres: number };
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();
  const images = hotel.images || [];

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const getStatusStyle = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'valider': 
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 size={12}/>, label: 'Publié' };
      case 'en_attente': 
        return { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock size={12}/>, label: 'En attente' };
      default: 
        return { bg: 'bg-slate-100', text: 'text-slate-600', icon: <AlertCircle size={12}/>, label: 'Brouillon' };
    }
  };

  const status = getStatusStyle(hotel.statut || 'brouillon');

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      
      {/* 1. IMAGE & CAROUSEL (Nettoyé des badges) */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {images.length > 0 ? (
          <>
            <img 
              src={`http://localhost:5000${images[currentImg].url}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={hotel.nom}
            />
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <button onClick={prevSlide} className="bg-white/90 p-1.5 rounded-full text-slate-800 shadow-md hover:bg-white transition-all">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextSlide} className="bg-white/90 p-1.5 rounded-full text-slate-800 shadow-md hover:bg-white transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-slate-50">
            <ImageOff size={40} strokeWidth={1} />
            <span className="text-[10px] font-bold uppercase mt-2">Pas d'image</span>
          </div>
        )}
      </div>

      {/* 2. INFOS DÉTAILLÉES */}
      <div className="p-5 flex-grow space-y-4">
        {/* Titre et Ville */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-black text-slate-900 truncate flex items-center gap-2 uppercase">
            <HotelIcon size={20} className="text-indigo-600 flex-shrink-0" />
            {hotel.nom}
          </h3>
        </div>

        {/* Adresse */}
        <div className="flex items-center text-slate-500 text-xs gap-1.5 -mt-2">
          <MapPin size={14} className="text-rose-500 flex-shrink-0" />
          <span className="truncate italic">{hotel.adresse}, {hotel.ville}</span>
        </div>

        {/* Description (Ajoutée ici) */}
        <div className="flex items-start gap-2 text-slate-600">
          <AlignLeft size={14} className="flex-shrink-0 mt-0.5 text-slate-400" />
          <p className="text-[11px] leading-relaxed line-clamp-2">
            {hotel.description || "Aucune description fournie pour cet hôtel."}
          </p>
        </div>

        {/* Prix */}
        <div className="flex flex-col gap-1 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
          {/* Libellé au-dessus */}
          <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest flex items-center gap-1.5">
            <Wallet size={12} className="flex-shrink-0" />
            Gamme de prix
          </p>

          {/* Valeurs en-dessous */}
          <p className="text-sm font-black text-indigo-700 flex items-center gap-1">
            {hotel.prixMin && hotel.prixMax ? (
              <>
                <span>{hotel.prixMin.toLocaleString()}</span>
                <span className="text-indigo-300 mx-0.5">-</span>
                <span>{hotel.prixMax.toLocaleString()}</span>
                <span className="ml-1 text-[10px] font-bold">FCFA</span>
              </>
            ) : (
              <span className="text-slate-400 italic font-medium">Prix non défini</span>
            )}
          </p>
        </div>

        {/* Statut et Nombre de chambres */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className={`flex items-center gap-1.5 ${status.text} text-[10px] font-bold uppercase`}>
            {status.icon}
            {status.label}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
            <BedDouble size={14} className="text-indigo-500" />
            {hotel._count?.chambres || 0} Chambres
          </div>
        </div>
      </div>

      {/* 3. ACTIONS */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button 
          onClick={() => navigate(`/manager/hotels/${hotel.idHotel}/details`)}
          className="col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <Eye size={14} /> Voir les détails
        </button>

        <button 
          onClick={() => navigate(`/manager/hotels/edit/${hotel.idHotel}`)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
        >
          <Edit3 size={14} /> Modifier
        </button>

        <button 
          onClick={() => navigate(`/manager/hotels/${hotel.idHotel}/images`)}
          className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95"
        >
          <PlusCircle size={14} /> Photos
        </button>
      </div>
    </div>
  );
};

export default HotelCard;