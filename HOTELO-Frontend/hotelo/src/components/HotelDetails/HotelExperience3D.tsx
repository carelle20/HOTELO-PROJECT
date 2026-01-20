import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { MapPin } from "lucide-react";

// 1. Interfaces de données pour la visite 3D
interface ScenePoint {
  vers: string;
  position: number[]; 
  label: string;
}

interface SceneData {
  id: string;
  nom: string;
  image: string;
  points?: ScenePoint[];
}

interface HotelExperience3DProps {
  // On utilise unknown au lieu de any pour plaire à ESLint
  data: unknown; 
}

function SceneComponent({ scene, onNavigate }: { scene: SceneData; onNavigate: (id: string) => void }) {
  const texture = useTexture(scene.image);

  return (
    <group>
      <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </Sphere>

      {scene.points?.map((point, index) => (
        // On force le cast en Vector3 car Three.js attend un type spécifique 
        // mais accepte un tableau de nombres au runtime
        <Html key={index} position={new THREE.Vector3(...point.position)}>
          <div className="flex flex-col items-center group">
            <button
              type="button"
              onClick={() => onNavigate(point.vers)}
              className="bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-yellow-400 hover:text-white transition-all animate-bounce"
            >
              <MapPin size={20} />
            </button>
            <span className="mt-1 px-2 py-1 bg-black/70 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {point.label}
            </span>
          </div>
        </Html>
      ))}
    </group>
  );
}

export default function HotelExperience3D({ data }: HotelExperience3DProps) {
  // 2. Fonction de "Type Guard" pour valider les données sans 'any'
  const [currentScene, setCurrentScene] = useState<SceneData>(() => {
    if (typeof data === "string") {
      return { id: "main", nom: "Vue principale", image: data };
    }
    
    // Si c'est un tableau, on le cast proprement
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as SceneData;
    }

    // Valeur par défaut pour éviter l'erreur de rendu
    return { id: "empty", nom: "Chargement...", image: "" };
  });

  const handleNavigate = (sceneId: string) => {
    if (Array.isArray(data)) {
      const next = (data as SceneData[]).find((s) => s.id === sceneId);
      if (next) setCurrentScene(next);
    }
  };

  if (!currentScene.image) return null;

  return (
    <div className="w-full h-[550px] relative group bg-slate-900 rounded-3xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 85 }}>
        <Suspense fallback={<Html center><div className="text-white">Chargement...</div></Html>}>
          <SceneComponent scene={currentScene} onNavigate={handleNavigate} />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            rotateSpeed={-0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-5 left-5 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-md border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Emplacement actuel</p>
          <h4 className="text-slate-800 font-bold">{currentScene.nom}</h4>
        </div>
      </div>
    </div>
  );
}