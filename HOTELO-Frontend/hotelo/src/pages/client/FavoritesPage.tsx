import { useEffect, useState } from "react";
import { clientService } from "../../services/client.service";
import { type Hotel } from "../../interfaces/client.interface";
import { toast } from "sonner";
import { Heart, MapPin, Phone, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await clientService.getFavoriteHotels();
        setFavorites(data);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
        toast.error("Erreur lors du chargement des favoris");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (hotelId: number) => {
    try {
      await clientService.removeFromFavorites(hotelId);
      setFavorites(favorites.filter((h) => h.idHotel !== hotelId));
      toast.success("Hôtel retiré des favoris");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du favori");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0B1E3A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0B1E3A] mb-2">Mes favoris</h1>
        <p className="text-gray-600">
          Hôtels favoris
        </p>
      </div>

      {/* Hotels Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((hotel) => (
            <div
              key={hotel.idHotel}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <Link to={`/hotels/${hotel.idHotel}`}>
                <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer">
                  {hotel.images && hotel.images.length > 0 ? (
                    <img
                      src={hotel.images[0].url}
                      alt={hotel.nom}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Pas d'image</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#0B1E3A] mb-2">
                  {hotel.nom}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin size={16} />
                  <span>
                    {hotel.ville}, {hotel.pays}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {hotel.description}
                </p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span className="truncate">{hotel.telephone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-yellow-500" />
                    <span>
                      {hotel.prixMin}€ - {hotel.prixMax}€
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/hotels/${hotel.idHotel}`}
                    className="flex-1 px-4 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium text-sm"
                  >
                    Voir détails
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(hotel.idHotel)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <Heart size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">Aucun favori pour le moment</p>
          <p className="text-sm text-gray-500 mb-4">
            Explorez nos hôtels et ajoutez-les à vos favoris !
          </p>
          <Link
            to="/discover"
            className="inline-block px-6 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium"
          >
            Découvrir les hôtels
          </Link>
        </div>
      )}
    </div>
  );
}
