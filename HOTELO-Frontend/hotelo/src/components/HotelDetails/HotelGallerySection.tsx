import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface ImageHotel {
  idImageHotel: number;
  url: string;
}

interface HotelGallerySectionProps {
  images: ImageHotel[];
  hotelName: string;
}

export default function HotelGallerySection({ images, hotelName }: HotelGallerySectionProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const goToNext = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <section className="w-full">
        <div className="w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <ImageIcon size={48} className="text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucune image disponible</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="grid gap-4">
        {/* Main Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden bg-slate-200 group">
          <img
            src={images[mainImageIndex].url}
            alt={`${hotelName} - Image ${mainImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-white"
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} className="text-slate-900" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-white"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} className="text-slate-900" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
            {mainImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </section>
  );
}
