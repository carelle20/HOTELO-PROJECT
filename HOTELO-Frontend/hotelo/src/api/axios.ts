// src/api/axios.ts
import axios from "axios";

/**
 * Création d'une instance Axios personnalisée
 * Cela évite de répéter l'URL de base et la configuration dans chaque fichier.
 */
const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Si le serveur ne répond pas après 10s, on arrête
});

/**
 * INTERCEPTEUR DE REQUÊTE
 * Ce code s'exécute AUTOMATIQUEMENT avant chaque envoi vers le backend.
 */
api.interceptors.request.use(
  (config) => {
    // On récupère le token stocké lors du login
    const token = localStorage.getItem("hotelo_token");
    
    // Si le token existe, on l'ajoute dans les headers (Authorization: Bearer ...)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTEUR DE RÉPONSE (Optionnel mais très utile)
 * Ce code s'exécute quand le backend répond.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le backend renvoie 401 (Non autorisé), c'est que le token est expiré ou invalide
    if (error.response && error.response.status === 401) {
      console.warn("Session expirée ou non autorisée");
    //   Optionnel : déconnecter l'utilisateur ou rediriger vers /connexion
      localStorage.removeItem("hotelo_token");
      window.location.href = "/connexion";
    }
    return Promise.reject(error);
  }
);

export default api;