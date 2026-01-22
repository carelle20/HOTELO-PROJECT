import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/inscription", AuthController.inscription);
router.post("/connexion", AuthController.connexion);

router.post(
  '/creer-admin', 
  authenticate, 
  authorize(['super_admin']), 
  AuthController.creerAdministrateur
);

router.patch(
  '/valider-hotelier/:id',
  authenticate,
  authorize(['admin', 'super_admin']),
  AuthController.validerHotelier // Utilise la méthode qu'on a ajoutée au contrôleur
);

export default router;