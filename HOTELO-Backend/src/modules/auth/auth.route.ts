import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.inscription);
router.post("/login", AuthController.connexion);
export default router;
