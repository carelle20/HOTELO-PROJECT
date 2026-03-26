import { useState, useEffect } from "react";
import {type Hotel } from "../interfaces/client.interface";
import { hotelService } from "../services/public.service";
import { getErrorMessage, logError } from "../lib/utils";

interface UseHomepageHotelsState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook personnalisé pour récupérer les 6 derniers hôtels pour la page d'accueil
 * @returns {UseHomepageHotelsState} État des hôtels, chargement et erreur
 */
export const useHomepageHotels = (): UseHomepageHotelsState => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotelService.getHotelsForHomepage();
        setHotels(data);
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Erreur lors du chargement des hôtels");
        setError(errorMessage);
        logError("useHomepageHotels", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return { hotels, loading, error };
};
