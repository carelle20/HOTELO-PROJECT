import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  /**
   * INSCRIPTION UTILISATEUR
   * - client
   * - chef_hotel (avec profil en attente de validation)
   */
  static async inscription(req: Request, res: Response) {
    try {
      const result = await AuthService.inscription(req.body);

      return res.status(201).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Erreur inscription :", error);

      return res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de l’inscription",
      });
    }
  }

  // Connexion utilisateur
  static async connexion(req: Request, res: Response) {
    try {
      const result = await AuthService.connexion(req.body);

      return res.status(200).json({
        success: true,
        token: result.token,
        utilisateur: result.utilisateur,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Identifiants invalides",
      });
    }
  }

}
