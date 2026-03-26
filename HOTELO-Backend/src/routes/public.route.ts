import { Router } from "express";
import { clientController } from "../controllers/client.controller";

const router = Router();

// Endpoints publics pour les clients
router.get("/hotels", clientController.getAllHotels);
router.get("/hotels/:id", clientController.getHotelById);
router.get("/homepage", clientController.getHotelsForHomepage);
router.get("/search", clientController.searchHotelsByCity);

export default router;