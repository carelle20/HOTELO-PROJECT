import { useState, useEffect } from "react";
import { type Hotel } from "../interfaces/client.interface";
import { hotelService } from "../services/public.service";
import { getErrorMessage, logError } from "../lib/utils";

interface UseHotelsState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer tous les hôtels publiés
 * @returns {UseHotelsState} État des hôtels, chargement et erreur
 */
export const useHotels = (): UseHotelsState => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotelService.getAllHotels();
        setHotels(data);
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Erreur lors du chargement des hôtels");
        setError(errorMessage);
        logError("useHotels", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return { hotels, loading, error };
};
