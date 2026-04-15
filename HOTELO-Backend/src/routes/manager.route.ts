import { Router } from "express";
import { ManagerController } from "../controllers/manager.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();
/* Routes pour le Chef hôtel uniquement */
router.use(authenticate, authorize(["chef_hotel"]));

// Dashboard et réservations - Endpoints GÉNÉRIQUES (pour tous les hôtels du chef)
router.get("/dashboard", ManagerController.getDashboardGeneral);
router.get("/reservations/pending", ManagerController.getAllPendingReservations);

// Endpoints spécifiques à un hôtel
router.get(
  "/dashboard/:hotelId",
  ManagerController.getDashboard
);
router.get("/hotels", ManagerController.getMyHotels);
router.post("/hotels/create", upload.fields([{name: "images", maxCount: 10}, {name: "documents", maxCount: 5}]), ManagerController.createHotel);
router.post('/hotels/:idHotel/images', upload.array('images', 5), ManagerController.uploadHotelImages);
// router.patch("/hotels/:idHotel/submit", authenticate, authorize(['chef_hotel']), ManagerController.submitHotel);
router.get("/hotels/:idHotel", ManagerController.getHotelById);
router.put("/hotels/:idHotel/edit", upload.single("imagePrincipale"), ManagerController.updateHotel);

// Gestion des chambres
router.get("/hotels/:idHotel/chambres", ManagerController.getChambres);
// Route pour ajouter une chambre
router.post(
  "/hotels/:idHotel/chambres", 
  upload.array("chambres", 10),
  ManagerController.addChambre
);

// Gestion des reservations

router.put(
  "/reservations/:id/confirm",
  ManagerController.confirmReservation
);
router.put(
  "/reservations/:id/reject",
  ManagerController.rejectReservation
);
router.get(
  "/reservations",
  ManagerController.getConfirmedReservations
);
router.get(
  "/reservations/stats",
  ManagerController.getReservationStats
);

// Factures
router.get(
  "/hotels/:hotelId/invoices",
  ManagerController.getHotelInvoices
);
router.put(
  "/hotels/:hotelId/invoices/:id/confirm-payment",
  ManagerController.confirmInvoicePayment
);
router.get(
  "/hotels/:hotelId/invoices/stats",
  ManagerController.getInvoiceStats
);

// Caisse
router.get(
  "/hotels/:hotelId/caisse/dashboard",
  ManagerController.getCaisseDashboard
);
router.get(
  "/hotels/:hotelId/caisse/entries",
  ManagerController.getCaisseEntries
);
router.post(
  "/hotels/:hotelId/caisse/entries",
  ManagerController.createCaisseEntry
);
router.get(
  "/hotels/:hotelId/caisse/stats",
  ManagerController.getCaisseStats
);
router.get(
  "/hotels/:hotelId/caisse/report",
  ManagerController.getCaisseReport
);

// Avis
router.get(
  "/hotels/:hotelId/reviews",
  ManagerController.getHotelReviews
);
router.get(
  "/hotels/:hotelId/reviews/stats",
  ManagerController.getReviewStats
);

export default router;
