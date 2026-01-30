// src/routes/admin.routes.ts
import { Router } from 'express';
import { getDashboardStats, getAllManagers, handleManagerStatus  } from '../controllers/admin.controller';

const router = Router();

// Route : GET /api/admin/stats
router.get('/stats', getDashboardStats);
router.get('/hotel-managers', getAllManagers);
router.patch('/valider-hotelier/:idUtilisateur', handleManagerStatus);

export default router;