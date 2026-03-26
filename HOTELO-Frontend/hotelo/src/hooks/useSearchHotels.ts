import { useState, useCallback } from "react";
import { type Hotel } from "../interfaces/client.interface";
import { hotelService } from "../services/public.service";
import { getErrorMessage, logError } from "../lib/utils";

/**
 * Hook personnalisé pour rechercher des hôtels par ville
 * @returns {UseSearchHotelsState & {search: (city: string) => Promise<void>}} État des résultats et fonction de recherche
 */
export const useSearchHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (city: string) => {
    if (!city.trim()) {
      setHotels([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await hotelService.searchHotelsByCity(city);
      setHotels(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erreur lors de la recherche");
      setError(errorMessage);
      logError("useSearchHotels", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { hotels, loading, error, search };
};
