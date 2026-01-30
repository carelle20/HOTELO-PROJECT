import { useState } from "react";
import {
  UploadCloud,
  Trash2,
  Star,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

interface RoomImage {
  id: number;
  url: string;
  isMain: boolean;
}

export default function GestionImagesChambre() {
  const [images, setImages] = useState<RoomImage[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
      isMain: true,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
      isMain: false,
    },
  ]);

  const setMainImage = (id: number) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === id,
      }))
    );
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/manager/rooms"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Images de la chambre
          </h1>
          <p className="text-sm text-gray-500">
            Ajoutez et gérez les images de cette chambre
          </p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center">
        <UploadCloud className="mx-auto text-gray-400" size={40} />
        <p className="mt-3 text-gray-600">
          Glissez-déposez vos images ici ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG — max 5 Mo par image
        </p>
      </div>

      {/* Images grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative bg-white rounded-xl overflow-hidden border border-gray-200 group"
          >
            <img
              src={img.url}
              alt="Chambre"
              className="h-48 w-full object-cover"
            />

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
              <button
                onClick={() => setMainImage(img.id)}
                className={`p-2 rounded-full ${
                  img.isMain
                    ? "bg-yellow-400 text-white"
                    : "bg-white text-gray-700"
                }`}
                title="Définir comme image principale"
              >
                <Star size={18} />
              </button>

              <button
                onClick={() => removeImage(img.id)}
                className="p-2 rounded-full bg-red-500 text-white"
                title="Supprimer l’image"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Badge principale */}
            {img.isMain && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-[#F4B400] text-[#0B1E3A]">
                Image principale
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
