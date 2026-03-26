import { useParams, useNavigate } from "react-router-dom";
import { useHotelDetails } from "../hooks";
import HotelExperience3D from "../components/HotelDetails/HotelExperience3D";
import { ArrowLeft, Loader2, BedDouble, ChevronRight, Info, ShieldCheck } from "lucide-react";
import type { visite3DPoint, visite3DScene } from "../interfaces/manager.interface";

export default function Hotel3DPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotel, loading } = useHotelDetails(Number(id));
  const url = "http://localhost:5000";

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0B1E3A]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-yellow-500" size={50} />
          <div className="absolute inset-0 blur-lg bg-yellow-500/20 animate-pulse" />
        </div>
        <p className="text-white/60 font-medium tracking-widest text-xs uppercase">Initialisation du moteur 3D</p>
      </div>
    </div>
  );

  const experienceData: visite3DScene[] = (hotel?.visite3D || []).map((scene) => ({
    identifiant: scene.identifiant || "id",
    nom: scene.nom || "Espace",
    image360Url: (scene.image360Url || "").startsWith('http') 
      ? scene.image360Url 
      : `${url}${scene.image360Url || ""}`,
    points: (scene.points || []).map((p: visite3DPoint) => ({
      label: p.label || "Point",
      versScene: p.versScene || "",
      positionX: Number(p.positionX) || 0,
      positionY: Number(p.positionY) || 0,
      positionZ: Number(p.positionZ) || 0,
    }))
  }));

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden font-sans antialiased text-slate-200">
      {/* HEADER PREMIUM */}
      <header className="h-20 flex items-center justify-between px-8 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md border-b border-white/5 z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-all"
          >
            <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 group-hover:bg-white/5 transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase hidden sm:inline">Quitter</span>
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {hotel?.nom}
              <ShieldCheck size={18} className="text-blue-400" />
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Visite Virtuelle Certifiée</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Mode Immersif</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR DESIGN - GLASSMORPHISM */}
        <aside className="w-[340px] bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
          <div className="p-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Navigation</h3>
              <BedDouble className="text-yellow-500" size={18} />
            </div>
            <div className="h-1 w-12 bg-yellow-500 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-10 scrollbar-none">
            {hotel?.chambres && hotel.chambres.length > 0 ? (
              hotel.chambres.map((chambre) => (
                <div 
                  key={chambre.idChambre}
                  className="group relative bg-gradient-to-br from-white/[0.08] to-transparent hover:from-white/[0.12] border border-white/10 rounded-3xl p-5 transition-all duration-500 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/reserver/${chambre.idChambre}`)}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">
                        {chambre.nom}
                      </h4>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">Tarif Excellence</p>
                        <p className="text-xl font-black text-white">
                          {chambre.prix.toLocaleString()} <span className="text-xs text-yellow-500 font-bold ml-1">FCFA</span>
                        </p>
                      </div>
                      <div className="h-10 w-10 bg-yellow-500 rounded-2xl flex items-center justify-center text-black scale-90 group-hover:scale-100 group-hover:rotate-[-10deg] transition-all duration-300 shadow-lg shadow-yellow-500/20">
                        <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Effet de lumière interne au hover */}
                  <div className="absolute -inset-x-20 -inset-y-20 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <Info size={40} />
                <p className="text-xs mt-4 font-bold uppercase">Aucune donnée</p>
              </div>
            )}
          </div>

          {/* FOOTER SIDEBAR */}
          <div className="p-8 bg-white/[0.02] border-t border-white/5">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Catalogue</span>
                <span className="text-sm font-black text-white">{hotel?.chambres?.length || 0} Unités</span>
             </div>
          </div>
        </aside>

        {/* ZONE 3D - MAXIMUM IMMERSION */}
        <main className="flex-1 relative">
          {experienceData.length > 0 ? (
            <div className="h-full w-full">
               <HotelExperience3D data={experienceData} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-900">
              <div className="text-center space-y-4">
                <Info className="mx-auto text-white/10" size={60} />
                <p className="text-white/20 font-black uppercase tracking-tighter text-2xl">Média non disponible</p>
              </div>
            </div>
          )}

          {/* CONTROLS OVERLAY - MINIMALIST */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
            <div className="px-6 py-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold italic">360</div>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Drag to Orbit</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[12px] font-bold">🔘</div>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Click to Travel</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}