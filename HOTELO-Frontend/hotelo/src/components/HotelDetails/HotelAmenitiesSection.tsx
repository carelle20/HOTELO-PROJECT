import { Wifi, Coffee, Utensils, Waves, Dumbbell, BarChart3, Wind, Shield, MapPin,
  Tv, Car, UtensilsCrossed, Users,
 } from "lucide-react";
interface Equipement {
  idEquipement: number;
  nom: string;
  icone?: string;
}

interface Service {
  idService: number;
  nom: string;
  icone?: string;
}

interface HotelAmenitiesSectionProps {
  equipements?: Equipement[];
  services?: Service[];
}

const iconMap: { [key: string]: React.ReactNode } = {
  "Wi-Fi": <Wifi size={28} />,
  "Petit-déjeuner inclus": <Coffee size={28} />,
  "Reception 24h/24": <Users size={28} />,
  restaurant: <Utensils size={28} />,
  "Navette aéroport": <Car size={28} />,
  "Service de chambre": <UtensilsCrossed size={28} />,
  piscine: <Waves size={28} />,
  "Mini-bar": <Tv size={28} />,
  "Salle de sport": <Dumbbell size={28} />,
  conference: <BarChart3 size={28} />,
  climatisation: <Wind size={28} />,
  securite: <Shield size={28} />,
  parking: <MapPin size={28} />,
};

function getIconForName(name: string | undefined): React.ReactNode {
  if (!name) return <Coffee size={28} />;
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
    for (const [key, icon] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) return icon;
  }
  return <Coffee size={28} />;
}

function AmenityItem({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition">
      <div className="text-blue-500">
        {getIconForName(name)}
      </div>
      <p className="text-sm font-medium text-slate-700 text-center">{name}</p>
    </div>
  );
}

export default function HotelAmenitiesSection({
  equipements = [],
  services = [],
}: HotelAmenitiesSectionProps) {
  
  if (equipements.length === 0 && services.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Équipements */}
      {equipements.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Équipements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {equipements.map((equipement, index) => (
              <AmenityItem
                key={`equipment-${equipement.idEquipement || index}`}
                name={equipement.nom}
              />
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {services.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <AmenityItem
                key={`service-${service.idService || index}`}
                name={service.nom}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
