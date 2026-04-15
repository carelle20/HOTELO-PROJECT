import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export const AdminController = {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await adminService.getStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getAllManagers(req: Request, res: Response) {
    try {
      const managers = await adminService.getAllManagers();
      return res.status(200).json(managers);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async handleManagerStatus(req: Request, res: Response) {
    try {
      // On récupère l'id et on s'assure que c'est une string
      const idParam = req.params.idUtilisateur;
      const idStr = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!idStr) {
        return res.status(400).json({ message: "ID manquant dans les paramètres" });
      }

      const idNum = parseInt(idStr, 10);

      if (isNaN(idNum)) {
        return res.status(400).json({ message: "L'ID fourni n'est pas un nombre valide" });
      }

      const { action } = req.body;
      const isValid = action ? action === 'Approuver' : true;

      const updatedUser = await adminService.ValidateManager(idNum, isValid);

      return res.status(200).json({
        success: true,
        message: isValid ? "Compte gérant activé" : "Compte gérant désactivé",
        data: updatedUser
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async addEquipement(req: Request, res: Response) {
    try {
      const { nom, icone } = req.body;
      const equip = await adminService.createEquipement(nom, icone);
      res.status(201).json(equip);
    } catch (error) {
      res.status(400).json({ message: "Cet équipement existe déjà ou données invalides" });
    }
  },

  async addService(req: Request, res: Response) {
    try {
      const { nom, icone } = req.body;
      const serv = await adminService.createService(nom, icone);
      res.status(201).json(serv);
    } catch (error) {
      res.status(400).json({ message: "Ce service existe déjà ou données invalides" });
    }
  },

  async getAllEquipements(req: Request, res: Response) {
    try {
      const equipements = await adminService.getAllEquipements();
      res.json(equipements);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération équipements" });
    }
  },
  
  async getAllServices(req: Request, res: Response) {
    try {
      const services = await adminService.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération services" });
    }
  },

  async getAllHotels(req: Request, res: Response) {
    try {
      const hotels = await adminService.getAllHotels();
      return res.status(200).json(hotels);
    } catch (error) {
      console.error("Erreur getHotels Admin:", error);
      return res.status(500).json({ message: "Erreur lors de la récupération des hôtels" });
    }
  },

   // Met à jour le statut d'un hôtel
  async updateHotelStatus(req: Request, res: Response) {
    try {
      const { idHotel } = req.params;
      const { statut } = req.body;
      if (!idHotel || !statut) {
        return res.status(400).json({ message: "ID hôtel et statut requis" });
      }

      if (statut !== "valider" && statut !== "refuser") {
        return res.status(400).json({ message: "Statut invalide. Utilisez 'valider' ou 'refuser'." });
      }

      const updatedHotel = await adminService.validateHotel(Number(idHotel), statut);
      
      return res.status(200).json({
        message: `L'hôtel a été ${statut === "valider" ? "validé" : "refusé"} avec succès`,
        hotel: updatedHotel
      });

    } catch (error) {
      console.error("Erreur updateHotelStatus Admin:", error);
      return res.status(500).json({ message: "Erreur lors de la validation de l'hôtel" });
    }
  }
};