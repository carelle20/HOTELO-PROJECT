import { useState, useCallback } from "react";
import { clientService } from "../services/client.service";
import type { ReservationRequest, ReservationResponse } from "../interfaces/client.interface";
import { toast } from "sonner";

interface UseReservationReturn {
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  reservation: ReservationResponse | null;
  createReservation: (data: ReservationRequest) => Promise<ReservationResponse>;
  cancelReservation: (id: number) => Promise<ReservationResponse>;
  checkAvailability: (
    hotelId: number,
    dateArrivee: string,
    dateDepart: string
  ) => Promise<{ disponible: boolean; raisons: string[] }>;
  clearError: () => void;
}

export const useReservation = (): UseReservationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createReservation = useCallback(
    async (data: ReservationRequest): Promise<ReservationResponse> => {
      setIsCreating(true);
      setError(null);
      try {
        const result = await clientService.createReservation(data);
        setReservation(result);
        if (result.success) {
          toast.success("Réservation créée avec succès !");
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la création de la réservation";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const cancelReservation = useCallback(async (id: number): Promise<ReservationResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await clientService.cancelReservation(id);
      if (result.success) {
        toast.success("Réservation annulée avec succès");
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'annulation";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAvailability = useCallback(
    async (hotelId: number, dateArrivee: string, dateDepart: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await clientService.checkAvailability(
          hotelId,
          dateArrivee,
          dateDepart
        );
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la vérification de disponibilité";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    isCreating,
    error,
    reservation,
    createReservation,
    cancelReservation,
    checkAvailability,
    clearError,
  };
};
