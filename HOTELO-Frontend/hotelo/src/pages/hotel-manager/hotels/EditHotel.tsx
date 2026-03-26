import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail,
ChevronRight, ChevronLeft, CheckCircle,
  Zap, ConciergeBell, Camera, Loader2, Save
} from "lucide-react";
import { managerService } from "../../../services/manager.service";
import { type CatalogItem, type ImageHotel } from "../../../interfaces/manager.interface";
import { toast } from "sonner";

export default function EditHotel() {
  const { idHotel } = useParams<{ idHotel: string }>();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<{equipements: CatalogItem[], services: CatalogItem[]}>({
    equipements: [],
    services: []
  });

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    pays: "Cameroun",
    ville: "",
    adresse: "",
    latitude: 0,
    longitude: 0,
    telephone: "",
    email: "",
    nombreChambres: 0,
    prixMin: 0,
    prixMax: 0,
    numeroRegistre: "",
    equipementsIds: [] as number[],
    servicesIds: [] as number[]
  });

  // 1. Chargement initial : Catalogue + Données de l'hôtel
    useEffect(() => {
    const initPage = async () => {
      if (!idHotel) {
        console.error("ID manquant dans l'URL");
        return;
      }

      try {
        setLoading(true);
        console.log("Début du chargement pour l'ID:", idHotel);

        // On récupère les données
        const [catalogData, hotelResponse] = await Promise.all([
          managerService.getCatalog().catch(err => {
            console.error("Erreur Catalogue:", err);
            return { equipements: [], services: [] }; // Fallback
          }),
          managerService.getHotelById(idHotel).catch(err => {
            console.error("Erreur HotelById:", err);
            return null;
          })
        ]);

        console.log("Données reçues du serveur:", hotelResponse);

        if (!hotelResponse) {
          toast.error("Hôtel introuvable");
          navigate("/manager/hotels");
          return;
        }

        // Extraction sécurisée des données
        // Parfois les données sont dans hotelResponse.data, parfois directement dans hotelResponse
        const h = hotelResponse.data || hotelResponse;

        setCatalog(catalogData);

        setFormData({
          nom: h.nom || "",
          description: h.description || "",
          pays: h.pays || "Cameroun",
          ville: h.ville || "",
          adresse: h.adresse || "",
          latitude: Number(h.latitude) || 0,
          longitude: Number(h.longitude) || 0,
          telephone: h.telephone || "",
          email: h.email || "",
          nombreChambres: Number(h.nombreChambres) || 0,
          prixMin: Number(h.prixMin) || 0,
          prixMax: Number(h.prixMax) || 0,
          numeroRegistre: h.numeroRegistre || "",
          // On vérifie si les relations existent avant de mapper
          equipementsIds: Array.isArray(h.equipements) 
            ? h.equipements.map((e: CatalogItem) => e.idEquipement) 
            : [],
          servicesIds: Array.isArray(h.services) 
            ? h.services.map((s: CatalogItem) => s.idService) 
            : []
        });

        if (h.images && h.images.length > 0) {
          const mainImg = h.images.find((img: ImageHotel) => img.estPrincipale);
          if (mainImg) setImagePreview(`http://localhost:5000${mainImg.url}`);
        }

      } catch (err) {
        console.error("Erreur critique dans initPage:", err);
        toast.error("Une erreur technique est survenue");
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [idHotel, navigate]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleSelection = (id: number, field: 'equipementsIds' | 'servicesIds'): void => {
    setFormData(prev => {
      const list = prev[field];
      const newList = list.includes(id) ? list.filter(i => i !== id) : [...list, id];
      return { ...prev, [field]: newList };
    });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!idHotel) return;
    setSaving(true);

    const data = new FormData();
    if (mainImage) data.append('imagePrincipale', mainImage);

    Object.entries(formData).forEach(([key, value]) => {
      // On gère les tableaux d'IDs (equipementsIds, servicesIds)
      if (Array.isArray(value)) {
        value.forEach((item) => {
          data.append(key, String(item)); // Envoie plusieurs fois la même clé
        });
      } 
      // On ignore les objets complexes (au cas où ils traînent dans le state)
      else if (value !== null && value !== undefined && typeof value !== 'object') {
        data.append(key, String(value));
      }
    });

    try {
      await managerService.updateHotel(idHotel, data);
      toast.success("Hôtel mis à jour !");
      navigate("/manager/hotels");
    } catch (error) {
      console.error("Erreur PUT:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Chargement de l'établissement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
       <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-blue-600 flex items-center gap-1 text-sm font-bold mb-2 hover:underline">
            <ChevronLeft size={16}/> Retour à la liste
          </button>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Modifier l'Établissement</h1>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-1.5 rounded-full transition-all ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* ÉTAPE 1 : IDENTITÉ & PHOTO */}
        {step === 1 && (
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl flex items-center gap-3 font-bold">
              <Camera size={22} />
              <span className="text-sm">VISUEL & IDENTITÉ</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Photo de couverture</label>
              <div className="relative group h-64 w-full rounded-[1.5rem] overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-inner transition-all">
                {imagePreview ? (
                   <>
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Prévisualisation" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                      <div className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase shadow-xl">Changer la photo</div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                   </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera className="text-slate-300 mb-2" size={32} />
                    <span className="text-sm text-slate-400 font-bold">Ajouter une image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest">Nom de l'hôtel</label>
                <input required name="nom" value={formData.nom} onChange={handleChange} className="w-full border-none bg-slate-50 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest">N° Registre</label>
                <input required name="numeroRegistre" value={formData.numeroRegistre} onChange={handleChange} className="w-full border-none bg-slate-50 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border-none bg-slate-50 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600 transition-all resize-none"/>
              </div>
            </div>
            <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              Suivant <ChevronRight size={18}/>
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : LOCALISATION */}
        {step === 2 && (
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl flex items-center gap-3 font-bold">
              <MapPin size={22} />
              <span className="text-sm uppercase tracking-widest">Emplacement & Contact</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Pays</label>
                <input required name="pays" value={formData.pays} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl font-bold"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Ville</label>
                <input required name="ville" value={formData.ville} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl font-bold"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Adresse</label>
                <input required name="adresse" value={formData.adresse} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl font-bold"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2"><Phone size={14}/> Téléphone</label>
                <input required name="telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2"><Mail size={14}/> Email</label>
                <input name="email" value={formData.email} type="email" onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 p-5 rounded-2xl font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
                <ChevronLeft size={18}/> Précédent
              </button>
              <button type="button" onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                Suivant <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : TARIFS & CATALOGUE */}
        {step === 3 && (
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl flex items-center gap-3 font-bold">
              <Zap size={22} />
              <span className="text-sm uppercase tracking-widest">Capacité & Services</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-[2rem]">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Chambres</label>
                <input required type="number" name="nombreChambres" value={formData.nombreChambres || 0} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-black text-blue-600 outline-none"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Prix Min (FCFA)</label>
                <input required type="number" name="prixMin" value={formData.prixMin || 0} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-black text-emerald-600 outline-none"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Prix Max (FCFA)</label>
                <input required type="number" name="prixMax" value={formData.prixMax || 0} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-black text-emerald-600 outline-none"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2"><Zap size={16}/> Équipements</h3>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {catalog.equipements.map((eq) => (
                    <label key={eq.idEquipement} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${formData.equipementsIds.includes(eq.idEquipement!) ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100 hover:bg-slate-50"}`}>
                      <span className={`text-sm font-bold ${formData.equipementsIds.includes(eq.idEquipement!) ? "text-amber-700" : "text-slate-600"}`}>{eq.nom}</span>
                      <input type="checkbox" className="hidden" checked={formData.equipementsIds.includes(eq.idEquipement!)} onChange={() => handleSelection(eq.idEquipement!, 'equipementsIds')} />
                      {formData.equipementsIds.includes(eq.idEquipement!) && <CheckCircle size={18} className="text-amber-500" />}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2"><ConciergeBell size={16}/> Services</h3>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {catalog.services.map((s) => (
                    <label key={s.idService} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${formData.servicesIds.includes(s.idService!) ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:bg-slate-50"}`}>
                      <span className={`text-sm font-bold ${formData.servicesIds.includes(s.idService!) ? "text-blue-700" : "text-slate-600"}`}>{s.nom}</span>
                      <input type="checkbox" className="hidden" checked={formData.servicesIds.includes(s.idService!)} onChange={() => handleSelection(s.idService!, 'servicesIds')} />
                      {formData.servicesIds.includes(s.idService!) && <CheckCircle size={18} className="text-blue-500" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-100 p-5 rounded-2xl font-black uppercase tracking-widest text-slate-500">
                Précédent
              </button>
              <button type="submit" disabled={saving} className="flex-[2] bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Enregistrer les modifications</>}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}