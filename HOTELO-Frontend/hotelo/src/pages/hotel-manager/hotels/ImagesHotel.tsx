import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { type ImageHotel } from '../../../interfaces/manager.interface';
import { managerService } from '../../../services/manager.service';

const ImagesHotel: React.FC = () => {
  const { idHotel } = useParams<{ idHotel: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serverUrl = "http://localhost:5000"; // Centralisation de l'URL
  
  const [existingImages, setExistingImages] = useState<ImageHotel[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Charger les images existantes
  const loadImages = useCallback(async (): Promise<void> => {
    if (!idHotel) return;
    try {
      const res = await api.get<ImageHotel[]>(`/manager/hotels/${idHotel}/images`);
      setExistingImages(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des images :", err);
    }
  }, [idHotel]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Gérer la sélection multiple
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // On ajoute aux fichiers déjà sélectionnés au lieu de les remplacer
      setSelectedFiles(prev => [...prev, ...filesArray]);

      // Création des aperçus
      const localPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...localPreviews]);
    }
  };

  // Supprimer un aperçu avant l'envoi
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Soumission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !idHotel) return;

    setLoading(true);
    const formData = new FormData();
    
    selectedFiles.forEach((file) => {
      // Clé 'images' pour correspondre à ton middleware Multer
      formData.append('images', file); 
    });

    try {
      // L'API va recevoir plusieurs fichiers et les enregistrer en base
      await managerService.uploadHotelImages(idHotel, formData);
      
      // Reset
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      await loadImages(); 
      alert("Galerie mise à jour !");
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Vérifiez la taille des fichiers (max 10Mo).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Galerie Photos</h2>
        <p className="text-gray-500">Ajoutez plusieurs photos pour valoriser votre établissement.</p>
      </header>

      {/* ZONE D'UPLOAD */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border mb-10">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-8 hover:bg-blue-50 transition-all"
        >
          <input 
            type="file" multiple accept="image/*"
            ref={fileInputRef} onChange={handleFileChange} className="hidden"
          />
          <span className="text-blue-600 font-medium">📷 Cliquez pour ajouter des photos</span>
          <span className="text-xs text-gray-400 mt-2">Plusieurs fichiers autorisés</span>
        </div>

        {/* Aperçu avant upload avec bouton supprimer */}
        {previews.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 group">
                  <img src={src} className="w-full h-full object-cover rounded-lg border" alt="preview" />
                  <button 
                    type="button"
                    onClick={() => removeSelectedFile(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || selectedFiles.length === 0}
          className={`mt-6 w-full py-3 rounded-xl text-white font-bold transition-all ${
            loading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? "Chargement..." : `Enregistrer les ${selectedFiles.length} photo(s)`}
        </button>
      </form>

      {/* AFFICHAGE DE LA GALERIE RÉELLE */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Photos enregistrées</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingImages.map((img) => (
            <div key={img.idImageHotel} className="relative aspect-square">
              <img 
                src={`${serverUrl}${img.url}`} 
                className={`w-full h-full object-cover rounded-xl border-2 ${img.estPrincipale ? 'border-yellow-400' : 'border-transparent'}`} 
                alt="Hôtel" 
              />
              {img.estPrincipale && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[9px] px-2 py-0.5 rounded-full font-bold">
                  ⭐ PRINCIPALE
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ImagesHotel;