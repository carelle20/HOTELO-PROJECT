import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async inscription(req: Request, res: Response) {
    try {
      const result = await AuthService.inscription(req.body);
      return res.status(201).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async creerAdministrateur(req: Request, res: Response) {
    try {
      const result = await AuthService.creerAdministrateur(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async connexion(req: Request, res: Response) {
    try {
      const { email, motDePasse } = req.body;
      const result = await AuthService.connexion(email, motDePasse);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  // J'ajoute la méthode ici pour que le contrôleur soit complet par rapport à la route
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
}