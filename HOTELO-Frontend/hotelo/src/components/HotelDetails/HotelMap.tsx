type HotelMapProps = {
  latitude: number;
  longitude: number;
  nom?: string;
};

export default function HotelMap({ latitude, longitude, nom }: HotelMapProps) {
  const query =
    typeof latitude === "number" && typeof longitude === "number"
      ? `${latitude},${longitude}`
      : "Douala";
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&output=embed`;

  return (
    <div className="bg-gray-50 shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Localisation</h3>

      <iframe
        title={`hotel-map-${nom ?? "map"}`}
        src={src}
        className="w-full h-80 rounded-xl "
        loading="lazy"
      />
    </div>
  );
}
