import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HotelGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative h-[420px] rounded-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-yellow-400" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
