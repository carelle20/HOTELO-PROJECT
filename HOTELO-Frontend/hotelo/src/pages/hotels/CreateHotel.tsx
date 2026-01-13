import HotelForm from "../../components/hotels/HotelForm";

export default function CreateHotel() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Créer un hôtel
      </h1>
      <p className="text-slate-500 mb-8">
        Ajoutez un nouvel établissement à votre catalogue
      </p>

      <HotelForm />
    </div>
  );
}
