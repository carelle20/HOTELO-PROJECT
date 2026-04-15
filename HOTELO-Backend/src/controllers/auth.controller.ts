import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  // INSCRIPTION
  static async inscription(req: Request, res: Response) {
    try {
      const result = await AuthService.inscription(req.body);
      return res.status(201).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // CREER ADMINISTRATEUR
  static async creerAdministrateur(req: Request, res: Response) {
    try {
      const result = await AuthService.creerAdministrateur(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // CONNEXION
  static async connexion(req: Request, res: Response) {
    try {
      const { email, motDePasse } = req.body;
      const result = await AuthService.connexion(email, motDePasse);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  // VALIDER HOTELIER
  static async validerHotelier(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }; 
      const utilisateurId = parseInt(id, 10);
      if (isNaN(utilisateurId)) {
        throw new Error("L'ID fourni n'est pas un nombre valide.");
      }
      const result = await AuthService.validerHotelier(utilisateurId);
      return res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error: any) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // PROFILE
  static async profile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Utilisateur non authentifié" 
        });
      }
      const user = await AuthService.userProfile(Number(userId));
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "Utilisateur introuvable" 
        });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      console.error("Erreur Profile Controller:", error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Erreur lors de la récupération du profil" 
      });
    }
  }
}