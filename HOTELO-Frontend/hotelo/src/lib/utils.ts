import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracteur de message d'erreur sécurisé
 * Vérifie si l'erreur est une instance d'Error et retourne le message approprié
 * @param error - L'erreur à traiter (type unknown)
 * @param defaultMessage - Message par défaut si l'erreur ne peut pas être extraite
 * @returns Le message d'erreur extrait ou le message par défaut
 */
export function getErrorMessage(error: unknown, defaultMessage: string = "Une erreur est survenue"): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    if (typeof err.message === "string") {
      return err.message;
    }
  }
  
  return defaultMessage;
}

/**
 * Logger une erreur avec type checking
 * @param context - Contexte où l'erreur s'est produite
 * @param error - L'erreur à logger
 */
export function logError(context: string, error: unknown): void {
  const message = getErrorMessage(error);
  console.error(`[${context}]`, message, error);
}