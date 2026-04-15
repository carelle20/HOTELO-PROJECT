import { useState, useEffect } from "react";
import { type Hotel, type Equipement, type Service } from "../interfaces/client.interface";
import { hotelService } from "../services/public.service";
import { getErrorMessage, logError } from "../lib/utils";

interface UseHotelDetailsState {
  hotel: Hotel | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les détails d'un hôtel
 * @param {number | string | null | undefined} hotelId 
 * @returns {UseHotelDetailsState} État de l'hôtel, chargement et erreur
 */
export const useHotelDetails = (hotelId: number | string | null | undefined): UseHotelDetailsState => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = typeof hotelId === "string" ? parseInt(hotelId, 10) : hotelId;
        if (isNaN(id)) throw new Error("ID d'hôtel invalide");

        const data = await hotelService.getHotelById(id);

        // Transformer les équipements et services s'ils sont imbriqués
        if (data.equipements && Array.isArray(data.equipements)) {
          data.equipements = data.equipements.map((item: unknown) => {
            if (item && typeof item === "object") {
              const record = item as Record<string, unknown>;
              if ("equipement" in record && record.equipement) {
                return record.equipement as Equipement;
              }
            }
            return item as Equipement;
          });
        }

        if (data.services && Array.isArray(data.services)) {
          data.services = data.services.map((item: unknown) => {
            if (item && typeof item === "object") {
              const record = item as Record<string, unknown>;
              if ("service" in record && record.service) {
                return record.service as Service;
              }
            }
            return item as Service;
          });
        }

        setHotel(data);
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Erreur lors du chargement de l'hôtel");
        setError(errorMessage);
        logError("useHotelDetails", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  return { hotel, loading, error };
};
