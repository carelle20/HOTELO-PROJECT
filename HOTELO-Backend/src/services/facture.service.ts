import prisma from "../prisma/client";
import {
  Facture,
  FactureRequest,
  StatutFacture,
} from "../interfaces/reservation.interface";

export const factureService = {
  /* Générer le numéro de facture unique */
  async genererNumeroFacture(hotelId: number): Promise<string> {
    const date = new Date();
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const jour = String(date.getDate()).padStart(2, "0");
    const timestamp = Date.now() % 10000; // 4 derniers chiffres du timestamp

    const numero = `FCT-${hotelId}-${annee}${mois}${jour}-${timestamp}`;
    return numero;
  },

  /* Créer une facture pour une réservation */
  async creerFacture(
    reservationId: number,
    tva: number = 20
  ): Promise<Facture> {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { idReservation: reservationId },
        include: {
          client: true,
          hotel: true,
          chambre: true,
        },
      });

      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }

      // Vérifier qu'une facture n'existe pas déjà
      const factureExistante = await prisma.facture.findUnique({
        where: { reservationId },
      });

      if (factureExistante) {
        return factureExistante as unknown as Facture;
      }

      // Calculer les montants
      const montantHT = reservation.montantTotal;
      const montantTVA = Math.round((montantHT * tva) / 100 * 100) / 100;
      const montantTTC = montantHT + montantTVA;

      // Générer le numéro de facture
      const numeroFacture = await this.genererNumeroFacture(
        reservation.hotelId
      );

      // Créer la facture
      const facture = await prisma.facture.create({
        data: {
          numeroFacture,
          montantHT,
          montantTVA,
          montantTTC,
          statut: "générée",
          reservationId,
          hotelId: reservation.hotelId,
          clientId: reservation.clientId,
        },
        include: {
          reservation: true,
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
              email: true,
            },
          },
          hotel: {
            select: {
              idHotel: true,
              nom: true,
            },
          },
        },
      });

      return facture as unknown as Facture;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    }
  },

  /* Récupérer une facture */
  async getFacture(factureId: number): Promise<Facture | null> {
    try {
      const facture = await prisma.facture.findUnique({
        where: { idFacture: factureId },
        include: {
          reservation: {
            include: {
              client: {
                select: {
                  idUtilisateur: true,
                  prenom: true,
                  nom: true,
                  email: true,
                },
              },
              chambre: true,
              hotel: {
                select: {
                  idHotel: true,
                  nom: true,
                  ville: true,
                  adresse: true,
                },
              },
            },
          },
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
              email: true,
            },
          },
          hotel: {
            select: {
              idHotel: true,
              nom: true,
              telephone: true,
              email: true,
              adresse: true,
            },
          },
        },
      });

      return facture as unknown as Facture | null;
    } catch (error) {
      console.error("Erreur lors de la récupération de la facture:", error);
      throw error;
    }
  },

  /* Récupérer les factures d'un client */
  async getFacturesClient(clientId: number): Promise<Facture[]> {
    try {
      const factures = await prisma.facture.findMany({
        where: { clientId },
        include: {
          reservation: {
            include: {
              chambre: true,
              hotel: {
                select: {
                  idHotel: true,
                  nom: true,
                  ville: true,
                },
              },
            },
          },
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
              email: true,
            },
          },
          hotel: {
            select: {
              idHotel: true,
              nom: true,
            },
          },
        },
        orderBy: { creeLe: "desc" },
      });

      return factures as unknown as Facture[];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des factures du client:",
        error
      );
      throw error;
    }
  },

  /* Récupérer les factures d'un hôtel */
  async getFacturesHotel(hotelId: number): Promise<Facture[]> {
    try {
      const factures = await prisma.facture.findMany({
        where: { hotelId },
        include: {
          reservation: {
            include: {
              client: {
                select: {
                  idUtilisateur: true,
                  prenom: true,
                  nom: true,
                  email: true,
                },
              },
              chambre: true,
            },
          },
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
              email: true,
            },
          },
        },
        orderBy: { creeLe: "desc" },
      });

      return factures as unknown as Facture[];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des factures de l'hôtel:",
        error
      );
      throw error;
    }
  },

  /* Confirmer le paiement d'une facture */
  async confirmerPaiement(factureId: number, methodePaiement: string, utilisateurId: number): Promise<Facture> {
    return await prisma.$transaction(async (tx) => {
      const facture = await tx.facture.findUnique({ where: { idFacture: factureId } });
      if (!facture) throw new Error("Facture non trouvée");
      if (facture.statut === "payée") throw new Error("Facture déjà payée");
      // Mettre à jour la facture
      const updated = await tx.facture.update({
        where: { idFacture: factureId },
        data: { statut: "payée", datePaiement: new Date() },
        include: { client: true, hotel: true }
      });
      // Mettre à jour la réservation liée
      await tx.reservation.update({
        where: { idReservation: facture.reservationId },
        data: { statut: "confirmée" } 
      });
      // Créer l'entrée de caisse
      await tx.caisse.create({
        data: {
          type: "revenus",
          description: `Paiement facture ${facture.numeroFacture} via ${methodePaiement}`,
          montant: facture.montantTTC,
          statut: "validée",
          hotelId: facture.hotelId,
          utilisateurId: utilisateurId,
          creePar: utilisateurId,
          factureId: factureId,
        },
      });
      return updated as unknown as Facture;
    });
  },

  /* Annuler une facture */
  async annulerFacture(
    factureId: number,
    motif: string
  ): Promise<Facture> {
    try {
      const facture = await prisma.facture.findUnique({
        where: { idFacture: factureId },
      });

      if (!facture) {
        throw new Error("Facture non trouvée");
      }

      // Mettre à jour le statut
      const updated = await prisma.facture.update({
        where: { idFacture: factureId },
        data: {
          statut: "annulée",
        },
        include: {
          reservation: true,
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
              email: true,
            },
          },
          hotel: {
            select: {
              idHotel: true,
              nom: true,
            },
          },
        },
      });

      return updated as unknown as Facture;
    } catch (error) {
      console.error("Erreur lors de l'annulation de la facture:", error);
      throw error;
    }
  },

  /* Obtenir les statistiques de facturation */
  async getStatsFacturation(hotelId: number): Promise<any> {
    try {
      const total = await prisma.facture.count({
        where: { hotelId },
      });

      const payees = await prisma.facture.count({
        where: { hotelId, statut: "payée" },
      });

      const montantTotal = await prisma.facture.aggregate({
        where: { hotelId },
        _sum: { montantTTC: true },
      });

      const montantPayes = await prisma.facture.aggregate({
        where: { hotelId, statut: "payée" },
        _sum: { montantTTC: true },
      });

      const montantEnAttente = (montantTotal._sum.montantTTC || 0) -
        (montantPayes._sum.montantTTC || 0);

      return {
        total,
        payees,
        montantTotal: montantTotal._sum.montantTTC || 0,
        montantPayes: montantPayes._sum.montantTTC || 0,
        montantEnAttente,
        tauxPaiement: total > 0 ? (payees / total) * 100 : 0,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques de facturation:",
        error
      );
      throw error;
    }
  },

  /* Générer un PDF pour la facture */
  async genererPDFFacture(factureId: number): Promise<string> {
    try {
      const facture = await this.getFacture(factureId);

      if (!facture) {
        throw new Error("Facture non trouvée");
      }
      const urlPDF = `/factures/${facture.numeroFacture}.pdf`;

      // Mettre à jour le champ urlPDF
      await prisma.facture.update({
        where: { idFacture: factureId },
        data: { urlPDF },
      });

      return urlPDF;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      throw error;
    }
  },
};
