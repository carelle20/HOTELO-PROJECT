import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { reservationService } from "../services/reservation.service";
import { factureService } from "../services/facture.service";
import { avisService } from "../services/avis.service";

export const reservationController = {
  /* Créer une réservation */
  async createReservation(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user!.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const data = req.body;
      // Validation basique
      if (
        !data.chambreId ||
        !data.hotelId ||
        !data.dateArrivee ||
        !data.dateDepart ||
        !data.nombrePersonnes
      ) {
        return res.status(400).json({ success: false, message: "Données manquantes" });
      }
      const reservation = await reservationService.createReservation(clientId, data);
      // Créer la facture associée
      const facture = await factureService.creerFacture(reservation.idReservation);
      return res.status(201).json({
        success: true,
        message: "Réservation créée avec succès",
        data: {reservation, facture},
      });
    } catch (error: unknown) {
      console.error("Erreur createReservation:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les réservations du client */
  async getMyReservations(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user!.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const reservations = await reservationService.getClientReservations(
        clientId
      );
      return res.status(200).json({
        success: true,
        data: reservations,
      });
    } catch (error: unknown) {
      console.error("Erreur getMyReservations:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer une réservation spécifique */
  async getReservationById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const reservation = await reservationService.getReservationById(
        Number(id),
        clientId
      );
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      return res.status(200).json({
        success: true,
        data: reservation,
      });
    } catch (error: unknown) {
      console.error("Erreur getReservationById:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Annuler une réservation */
  async cancelReservation(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user!.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const reservation = await reservationService.cancelReservation(Number(id), clientId);
      return res.status(200).json({
        success: true,
        message: "Réservation annulée",
        data: reservation,
      });
    } catch (error: unknown) {
      console.error("Erreur cancelReservation:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Mettre a jour une reservation */
  async updateReservation(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: "L'identifiant de la réservation est requis." 
        });
      }
      const updatedReservation = await reservationService.updateReservation(
        Number(id), 
        updateData
      );
      return res.status(200).json({
        success: true,
        message: "Réservation mise à jour avec succès",
        data: updatedReservation
      });
    } catch (error: any) {
      console.error("Erreur Controller Update:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Une erreur est survenue lors de la mise à jour."
      });
    }
  },

  /* Vérifier la disponibilité */
  async checkAvailability(req: AuthRequest, res: Response) {
    try {
      const { chambreId, dateArrivee, dateDepart } = req.query;

      if (!chambreId || !dateArrivee || !dateDepart) {
        return res.status(400).json({ success: false, message: "Données manquantes" });
      }
      const disponibilite = await reservationService.verifierDisponibilite(
        Number(chambreId),
        String(dateArrivee),
        String(dateDepart)
      );

      return res.status(200).json({
        success: true,
        data: disponibilite,
        message: disponibilite ? "Chambre disponible" : "Chambre non disponible",
      });
    } catch (error: unknown) {
      console.error("Erreur checkAvailability:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({success: false, message });
    }
  },

  /* Récupérer les factures du client */
  async getMyInvoices(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const factures = await factureService.getFacturesClient(clientId);
      return res.status(200).json({
        success: true,
        data: factures,
      });
    } catch (error: unknown) {
      console.error("Erreur getMyInvoices:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer une facture spécifique */
  async getInvoiceById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const facture = await factureService.getFacture(Number(id));
      if (!facture) {
        return res.status(404).json({ message: "Facture non trouvée" });
      }
      // Vérifier que la facture appartient au client
      if (facture.clientId !== clientId) {
        return res.status(403).json({ message: "Accès non autorisé" });
      }
      return res.status(200).json({
        success: true,
        data: facture,
      });
    } catch (error: unknown) {
      console.error("Erreur getInvoiceById:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Télécharger une facture en PDF */
  async downloadInvoice(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const facture = await factureService.getFacture(Number(id));
      if (!facture) {
        return res.status(404).json({ message: "Facture non trouvée" });
      }
      if (facture.clientId !== clientId) {
        return res.status(403).json({ message: "Accès non autorisé" });
      }
      // Générer le PDF
      const urlPDF = facture.urlPDF || (await factureService.genererPDFFacture(Number(id)));
      return res.status(200).json({
        success: true,
        message: "Facture disponible",
        data: { urlPDF },
      });
    } catch (error: unknown) {
      console.error("Erreur downloadInvoice:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Créer un avis */
  async createReview(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const avis = await avisService.creerAvis(clientId, req.body);
      return res.status(201).json({
        success: true,
        message: "Avis créé avec succès",
        data: avis,
      });
    } catch (error: unknown) {
      console.error("Erreur createReview:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les avis du client */
  async getMyReviews(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const avis = await avisService.getAvisClient(clientId);
      return res.status(200).json({
        success: true,
        data: avis,
      });
    } catch (error: unknown) {
      console.error("Erreur getMyReviews:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Mettre à jour un avis */
  async updateReview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user?.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const avis = await avisService.mettreAJourAvis(
        Number(id),
        clientId,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: "Avis mis à jour",
        data: avis,
      });
    } catch (error: unknown) {
      console.error("Erreur updateReview:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Supprimer un avis */
  async deleteReview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user?.id;

      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      await avisService.supprimerAvis(Number(id), clientId);

      return res.status(200).json({
        success: true,
        message: "Avis supprimé",
      });
    } catch (error: unknown) {
      console.error("Erreur deleteReview:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer le dashboard du client */
  async getClientDashboard(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user!.id;
      if (!clientId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      // Statistiques
      const [reservations, avis, factures] = await Promise.all([
        reservationService.getClientReservations(clientId),
        avisService.getAvisClient(clientId),
        factureService.getFacturesClient(clientId)
      ]);

      const totalReservations = reservations.length;
      const upcomingStays = reservations.filter(
        (r) => new Date(r.dateArrivee) > new Date() && r.statut === "confirmée"
      ).length;
      const cancelledReservations = reservations.filter(
        (r) => r.statut === "annulée"
      ).length;
      const totalSpent = reservations
        .filter((r) => r.statut === "confirmée")
        .reduce((sum, r) => sum + r.montantTotal, 0);

      return res.status(200).json({
        success: true,
        data: {
          totalReservations,
          upcomingStays,
          cancelledReservations,
          totalSpent,
          upcomingReservations: reservations
            .filter((r) => r.statut === "confirmée")
            .sort(
              (a, b) =>
                new Date(a.dateArrivee).getTime() -
                new Date(b.dateArrivee).getTime()
            )
            .slice(0, 5),
          recentReviews: avis.slice(0, 3),
        },
      });
    } catch (error: unknown) {
      console.error("Erreur getDashboard:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },
};
