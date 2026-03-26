interface HotelDescriptionProps {
  description: string;
}

export default function HotelDescription({ description }: HotelDescriptionProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">À propos de cet hôtel</h2>
      <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
    </section>
  );
}
