import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Hotel, MapPin, Phone, Mail, Navigation, ClipboardCheck, 
  BedDouble, Tag, ChevronRight, ChevronLeft, CheckCircle,
  Zap, ConciergeBell, Globe, Camera, X
} from "lucide-react";
import { managerService } from "../../../services/manager.service";
import { type CatalogItem } from "../../../interfaces/manager.interface";
import { toast } from "sonner";

export default function CreateHotel() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  
  // États pour la gestion de plusieurs images
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchCatalog = async (): Promise<void> => {
      try {
        const data = await managerService.getCatalog();
        setCatalog(data);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger le catalogue");
      }
    };
    fetchCatalog();
  }, []);

  // Gestion de l'ajout multiple d'images
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]); 
      return prev.filter((_, i) => i !== index);
    });
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
    
    if (selectedFiles.length < 3) {
      toast.error("Veuillez ajouter au moins une photo pour votre hôtel.");
      setStep(1);
      return;
    }

    setLoading(true);

    const data = new FormData();
    
    selectedFiles.forEach((file) => {
      data.append('images', file);
    });

    data.append('statut', 'valider');
    data.append('estPublie', 'true');

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, String(value));
      }
    });

    try {
      await managerService.createHotel(data);
      toast.success("Hôtel publié avec succès !");
      navigate("/manager/hotels");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement de l'hôtel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Ajouter un Établissement</h1>
          <p className="text-slate-500">Complétez les informations pour référencer votre hôtel.</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-2 rounded-full ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* ÉTAPE 1 : IDENTITÉ & PHOTOS */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <ClipboardCheck size={20} />
              <span>ÉTAPE 1 : IDENTITÉ ET PHOTOS</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Camera size={16}/> Photos de l'établissement</label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* LISTE DES PRÉVISUALISATIONS */}
                {previews.map((src, index) => (
                  <div key={index} className="relative h-32 rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                    <img src={src} className="w-full h-full object-cover" alt={`Prévisualisation ${index}`} />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase">Principale</div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {/* BOUTON D'AJOUT */}
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all">
                  <Camera className="text-slate-400 mb-1" size={24} />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Ajouter</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Hotel size={16}/> Nom de l'hôtel</label>
                <input required name="nom" value={formData.nom} placeholder="Ex: Hilton Douala" onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Tag size={16}/> N° Registre de Commerce</label>
                <input required name="numeroRegistre" value={formData.numeroRegistre} placeholder="Ex: RC/DLA/2024/B/001" onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold">Description de l'établissement</label>
                <textarea required name="description" value={formData.description} placeholder="Parlez-nous de votre hôtel..." onChange={handleChange} className="w-full border p-3 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
              </div>
            </div>
            <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
              Suivant <ChevronRight size={18}/>
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : LOCALISATION & CONTACT */}
        {step === 2 && (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <MapPin size={20} />
              <span>ÉTAPE 2 : LOCALISATION ET COORDONNÉES</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Globe size={16}/> Pays</label>
                <input required name="pays" value={formData.pays} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ville</label>
                <input required name="ville" value={formData.ville} placeholder="Ex: Yaoundé" onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Adresse</label>
                <input required name="adresse" value={formData.adresse} placeholder="Quartier, Rue..." onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Navigation size={16}/> Latitude</label>
                <input required type="number" step="any" name="latitude" value={isNaN(formData.latitude) ? "" : formData.latitude} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Navigation size={16}/> Longitude</label>
                <input required type="number" step="any" name="longitude" value={isNaN(formData.longitude) ? "" : formData.longitude} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Phone size={16}/> Téléphone</label>
                <input required name="telephone" value={formData.telephone} placeholder="+237..." onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Mail size={16}/> Email (Optionnel)</label>
                <input name="email" value={formData.email} type="email" placeholder="contact@hotel.com" onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <ChevronLeft size={18}/> Retour
              </button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                Suivant <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : SERVICES & CAPACITÉ */}
        {step === 3 && (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <Zap size={20} />
              <span>ÉTAPE 3 : SERVICES ET TARIFS</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><BedDouble size={16}/> Chambres</label>
                <input required type="number" name="nombreChambres" value={isNaN(formData.nombreChambres) ? "" : formData.nombreChambres} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Prix Min (FCFA)</label>
                <input required type="number" name="prixMin" value={isNaN(formData.prixMin) ? "" : formData.prixMin} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Prix Max (FCFA)</label>
                <input required type="number" name="prixMax" value={isNaN(formData.prixMax) ? "" : formData.prixMax} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-4">
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 border-b pb-2"><Zap size={18} className="text-amber-500"/> Équipements</h3>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                  {catalog.equipements.map((eq) => (
                    <label key={eq.idEquipement} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-blue-600" 
                        checked={formData.equipementsIds.includes(eq.idEquipement!)}
                        onChange={() => handleSelection(eq.idEquipement!, 'equipementsIds')}
                      />
                      <span className="text-sm">{eq.nom}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 border-b pb-2"><ConciergeBell size={18} className="text-emerald-500"/> Services</h3>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                  {catalog.services.map((s) => (
                    <label key={s.idService} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-blue-600" 
                        checked={formData.servicesIds.includes(s.idService!)}
                        onChange={() => handleSelection(s.idService!, 'servicesIds')}
                      />
                      <span className="text-sm">{s.nom}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-100 p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <ChevronLeft size={18}/> Retour
              </button>
              <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                {loading ? "Publication en cours..." : <><CheckCircle size={20}/> PUBLIER L'ÉTABLISSEMENT</>}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}