import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getStats();
    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllManagers = async (req: Request, res: Response) => {
  try {
    const managers = await adminService.getAllManagers();
    return res.status(200).json(managers);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const handleManagerStatus = async (req: Request, res: Response) => {
  try {
    // On récupère l'id et on s'assure que c'est une string
    const idParam = req.params.idUtilisateur;
    
    // Sécurité TypeScript : si c'est un tableau, on prend le premier élément
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
};