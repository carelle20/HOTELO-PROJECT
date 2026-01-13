import { useState } from "react";
import AmenitiesSelector from "./AmenitiesSelector";
import type { Hotel } from "../../data/hotels.manager.mock";
import { hotel } from "../../data/hotels.manager.mock";
import { useAuth } from "../../context/useAuth";


export default function HotelForm() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const newHotel: Hotel = {
      id: Date.now(),
      name,
      city,
      description,
      amenities,
      images: [],
      ownerId: user.id,
    };

    hotel.push(newHotel);

    alert("Hôtel créé avec succès");

    setName("");
    setCity("");
    setDescription("");
    setAmenities([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="font-bold text-sm">Nom de l’hôtel</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-2 p-3 rounded-xl border"
        />
      </div>

      <div>
        <label className="font-bold text-sm">Ville</label>
        <input
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full mt-2 p-3 rounded-xl border"
        />
      </div>

      <div>
        <label className="font-bold text-sm">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-2 p-3 rounded-xl border min-h-[120px]"
        />
      </div>

      <div>
        <label className="font-bold text-sm mb-2 block">
          Équipements
        </label>
        <AmenitiesSelector
          selected={amenities}
          onChange={setAmenities}
        />
      </div>

      <button
        type="submit"
        className="bg-yellow-400 px-6 py-3 rounded-xl font-bold text-[#0B1E3A]"
      >
        Enregistrer l’hôtel
      </button>
    </form>
  );
}
