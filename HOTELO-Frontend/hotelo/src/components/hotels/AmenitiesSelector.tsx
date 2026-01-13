interface Props {
  selected: string[];
  onChange: (values: string[]) => void;
}

const AMENITIES = [
  "Wi-Fi",
  "Piscine",
  "Parking",
  "Climatisation",
  "Restaurant",
  "Salle de sport",
];

export default function AmenitiesSelector({ selected, onChange }: Props) {
  const toggleAmenity = (amenity: string) => {
    onChange(
      selected.includes(amenity)
        ? selected.filter((a) => a !== amenity)
        : [...selected, amenity]
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {AMENITIES.map((amenity) => (
        <button
          key={amenity}
          type="button"
          onClick={() => toggleAmenity(amenity)}
          className={`rounded-xl py-2 text-sm font-semibold transition ${
            selected.includes(amenity)
              ? "bg-[#0B1E3A] text-yellow-400"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {amenity}
        </button>
      ))}
    </div>
  );
}
