import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { clientService } from "../services/client.service";
import { type Hotel } from "../interfaces/client.interface";

export const clientController = {
  // Récupérer les hôtels disponibles pour les clients
  async getAllHotels (req: Request, res: Response) {
        try {
            const hotels: Hotel[] = await clientService.getAllHotels();
            return res.status(200).json(hotels || []);
        } catch (error: unknown) {
            console.error("Erreur getHotels Client:", error);
            return res.status(500).json({ message: error instanceof Error ? error.message : "Erreur serveur" });
        }
    },

    async getHotelById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const hotel: Hotel | null = await clientService.getHotelById(Number(id));
            if (!hotel) {
                return res.status(404).json({ message: "Hôtel non trouvé" });
            }
            return res.status(200).json(hotel);
        } catch (error: unknown) {            
            console.error("Erreur getHotelById Client:", error);
            return res.status(500).json({ message: error instanceof Error ? error.message : "Erreur serveur" });
        }
    },

    // Récupérer les hôtels pour la page d'accueil
    async getHotelsForHomepage(req: Request, res: Response) {
        try {
            const hotels: Hotel[] = await clientService.getHotelsForHomepage();
            return res.status(200).json(hotels || []);
        } catch (error: unknown) {
            console.error("Erreur getHotelsForHomepage:", error);
            return res.status(500).json({ message: error instanceof Error ? error.message : "Erreur serveur" });
        }
    },

    // Rechercher des hôtels par ville
    async searchHotelsByCity(req: Request, res: Response) {
        try {
            const { city } = req.query;
            if (!city || typeof city !== "string") {
                return res.status(400).json({ message: "Le paramètre 'city' est requis" });
            }
            const hotels: Hotel[] = await clientService.searchHotelsByCity(city);
            return res.status(200).json(hotels);
        } catch (error: any) {
            console.error("Erreur searchHotelsByCity:", error);
            return res.status(500).json({ message: error.message });
        }
    },
};