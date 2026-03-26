import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { managerService } from '../../../services/manager.service';

interface ChambreFormData {
  nom: string;
  description: string;
  capacite: string;
  prix: string;
}

const AddChambre: React.FC = () => {
  const { idHotel } = useParams<{ idHotel: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ChambreFormData>({
    nom: '',
    description: '',
    capacite: '',
    prix: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Gestion des inputs texte
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des images
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e. target.files);
      setSelectedImages(prev => [...prev, ...filesArray]);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!idHotel) return;

    // Validation : Minimum 3 images
    if (selectedImages.length < 3) {
      toast.error("Veuillez sélectionner au moins 3 images.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('description', formData.description);
    data.append('capacite', formData.capacite);
    data.append('prix', formData.prix);

    // Ajout des fichiers au FormData
    selectedImages.forEach((file) => {
      data.append('chambres', file);
    });

    try {
      await managerService.createChambre(idHotel, data);
      toast.success("Chambre ajoutée avec succès !");
      navigate(`/manager/hotels/${idHotel}/details`);
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 mb-6 hover:text-blue-600 transition"
      >
        <ArrowLeft size={20} className="mr-2" /> Retour
      </button>

      <h1 className="text-2xl font-bold mb-8">Ajouter une nouvelle chambre</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom de la chambre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom de la chambre</label>
            <input
              required
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Suite Royale"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Prix par nuit */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Prix par nuit (FCFA)</label>
            <input
              required
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Capacité */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Capacité (personnes)</label>
            <input
              required
              type="number"
              name="capacite"
              value={formData.capacite}
              onChange={handleChange}
              placeholder="Ex: 2"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Détails de la chambre, vue, lit..."
          ></textarea>
        </div>

        {/* Zone Images */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Images de la chambre (Minimum 3 requises)
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group aspect-square">
                <img 
                  src={src} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg border" 
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-square cursor-pointer hover:bg-gray-50 transition">
              <Plus className="text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Ajouter</span>
              <input 
                type="file" 
                multiple 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Création en cours...' : 'Créer la chambre'}
        </button>
      </form>
    </div>
  );
};

export default AddChambre;