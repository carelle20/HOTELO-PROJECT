import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { MapPin } from "lucide-react";
import { type visite3DScene } from "../../interfaces/manager.interface";

// Sous-composant pour le contenu de la scène
function SceneContent({ 
  scene, 
  onNavigate 
}: { 
  scene: visite3DScene; 
  onNavigate: (identifiant: string) => void 
}) {
  const texture = useTexture(scene.image360Url);

  return (
    <group>
      {/* La sphère 360° */}
      <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </Sphere>

      {/* Rendu des points de navigation (Hotspots) */}
      {scene.points?.map((point, index) => (
        <Html 
          key={index} 
          // Conversion des coordonnées X, Y, Z individuelles en vecteur Three.js
          position={[point.positionX, point.positionY, point.positionZ]}
        >
          <button
            onClick={() => onNavigate(point.versScene)}
            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-yellow-400 transition-all transform hover:scale-110 group flex items-center justify-center"
            title={point.label}
          >
            <MapPin className="text-blue-600 group-hover:text-white" size={20} />
            
            {/* Label au survol */}
            <span className="absolute top-full mt-2 bg-[#0B1E3A] text-white text-[10px] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              {point.label}
            </span>
          </button>
        </Html>
      ))}
    </group>
  );
}

export default function HotelExperience3D({ data }: { data: visite3DScene[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScene = data[currentIndex];

  // Gestion du changement de scène
  const handleNavigate = (identifiant: string) => {
    const idx = data.findIndex((s) => s.identifiant === identifiant);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  if (!currentScene) return (
    <div className="w-full h-[550px] flex items-center justify-center bg-slate-100 rounded-3xl border-2 border-dashed border-gray-300">
      <p className="text-gray-400">Aucune scène 3D disponible</p>
    </div>
  );

  return (
    <div className="w-full h-[550px] relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-white">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 80 }}>
        <Suspense fallback={<Html center className="text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Chargement du panorama...</Html>}>
          <SceneContent 
            scene={currentScene} 
            onNavigate={handleNavigate} 
          />
          {/* Controls : rotation inverse pour un feeling naturel, zoom activé */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            rotateSpeed={-0.4} 
            minDistance={1}
            maxDistance={100}
          />
        </Suspense>
      </Canvas>

      {/* Barre de navigation par miniatures (Overlay) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 max-w-[90%] overflow-x-auto scrollbar-hide">
        {data.map((scene, index) => (
          <button
            key={scene.identifiant}
            onClick={() => setCurrentIndex(index)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
              currentIndex === index 
                ? "border-yellow-400 scale-110 shadow-lg ring-2 ring-yellow-400/50" 
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={scene.image360Url} className="w-full h-full object-cover" alt={scene.nom} />
          </button>
        ))}
      </div>

      {/* Badge d'information scène (Top Left) */}
      <div className="absolute top-6 left-6 bg-white/90 p-4 rounded-2xl shadow-md border border-slate-200 backdrop-blur-sm">
        <h4 className="text-[#0B1E3A] font-bold text-lg leading-tight">{currentScene.nom}</h4>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">Mode Immersif 360°</p>
        </div>
      </div>
    </div>
  );
}