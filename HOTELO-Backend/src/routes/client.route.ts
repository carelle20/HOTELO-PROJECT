import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { reservationController } from "../controllers/reservation.controller";

const router = Router();

// Routes necessitant une authentification pour le role client
router.use(authenticate, authorize(["client"]));

// Dashboard client
router.get(
  "/dashboard",
  reservationController.getClientDashboard
);

// Réservations
router.post(
  "/reservations",
  reservationController.createReservation
);
router.get(
  "/reservations",
  reservationController.getMyReservations
);
router.get(
  "/reservations/:id",
  reservationController.getReservationById
);
router.delete(
  "/reservations/:id",
  reservationController.cancelReservation
);
router.patch('/reservations/:id',
  reservationController.updateReservation
);
router.get(
  "/availability",
  reservationController.checkAvailability
);

// Factures
router.get(
  "/invoices",
  reservationController.getMyInvoices
);
router.get(
  "/invoices/:id",
  reservationController.getInvoiceById
);
router.get(
  "/invoices/:id/download",
  reservationController.downloadInvoice
);

// Avis
router.post(
  "/reviews",
  reservationController.createReview
);
router.get(
  "/reviews",
  reservationController.getMyReviews
);
router.put(
  "/reviews/:id",
  reservationController.updateReview
);
router.delete(
  "/reviews/:id",
  reservationController.deleteReview
);

export default router;
