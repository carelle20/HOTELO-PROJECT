// src/routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// On garde l'authentification pour tout le monde
router.use(authenticate);

// --- ROUTES RÉSERVÉES UNIQUEMENT AUX ADMINS ---
const adminOnly = authorize(['admin', 'super_admin']);

router.get('/dashboard', adminOnly, AdminController.getDashboardStats);
router.get('/hotel-managers', adminOnly, AdminController.getAllManagers);
router.patch('/valider-hotelier/:idUtilisateur', adminOnly, AdminController.handleManagerStatus);
router.post("/catalog/equipements", adminOnly, AdminController.addEquipement);
router.post("/catalog/services", adminOnly, AdminController.addService);
router.get("/hotels", adminOnly, AdminController.getAllHotels);
router.patch("/hotels/:idHotel/validate", adminOnly, AdminController.updateHotelStatus);

// --- ROUTES ACCESSIBLES AUSSI AUX MANAGERS ---
router.get("/catalog/equipements", authorize(['admin', 'chef_hotel', 'client']), AdminController.getAllEquipements);
router.get("/catalog/services", authorize(['admin', 'chef_hotel', 'client']), AdminController.getAllServices);

export default router;