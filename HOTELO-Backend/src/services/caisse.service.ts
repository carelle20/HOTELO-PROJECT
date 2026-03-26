import prisma from "../prisma/client";
import {
  EntreeCaisse,
  EntreeCaisseRequest,
  StatistiquesCaisse,
  TypeCaisse,
} from "../interfaces/reservation.interface";

export const caisseService = {
  /* Créer une entrée de caisse */
  async creerEntree(data: EntreeCaisseRequest): Promise<EntreeCaisse> {
    try {
      // Vérifier que l'hôtel existe
      const hotel = await prisma.hotel.findUnique({
        where: { idHotel: data.hotelId },
      });
      if (!hotel) {
        throw new Error("Hôtel non trouvé");
      }
      // Valider le montant
      if (data.montant <= 0) {
        throw new Error("Le montant doit être positif");
      }
      // Créer l'entrée
      const entree = await prisma.caisse.create({
        data: {
          type: data.type,
          description: data.description,
          montant: data.montant,
          statut: "validée",
          hotelId: data.hotelId,
          utilisateurId: 1, // À définir selon le contexte (le chef hôtel qui la crée)
          creePar: 1, // À définir selon le contexte (le chef hôtel qui la crée)
          reservationId: data.reservationId,
        },
      });

      return entree as unknown as EntreeCaisse;
    } catch (error) {
      console.error("Erreur lors de la création de l'entrée de caisse:", error);
      throw error;
    }
  },

  /**
   * Récupérer les entrées de caisse d'un hôtel
   */
  async getEntreesHotel(
    hotelId: number,
    type?: TypeCaisse,
    limit: number = 50
  ): Promise<EntreeCaisse[]> {
    try {
      const where: any = { hotelId };

      if (type) {
        where.type = type;
      }

      const entrees = await prisma.caisse.findMany({
        where,
        orderBy: { creeLe: "desc" },
        take: limit,
      });

      return entrees as unknown as EntreeCaisse[];
    } catch (error) {
      console.error("Erreur lors de la récupération des entrées de caisse:", error);
      throw error;
    }
  },

  /* Obtenir les statistiques de caisse pour un hôtel */
  async getStatistiquesHotel(hotelId: number) {
    // Utilisation de Promise.all pour exécuter les requêtes en parallèle (plus rapide)
    const [revenus, depenses, reservations] = await Promise.all([
      prisma.caisse.aggregate({
        where: { hotelId, type: "revenus", statut: "validée" },
        _sum: { montant: true }
      }),
      prisma.caisse.aggregate({
        where: { hotelId, type: "dépenses", statut: "validée" },
        _sum: { montant: true }
      }),
      prisma.reservation.groupBy({
        by: ['statut'],
        where: { hotelId },
        _count: true,
        _sum: { montantTotal: true }
      })
    ]);

    const totalRev = revenus._sum.montant || 0;
    const totalDep = depenses._sum.montant || 0;

    return {
      solde: totalRev - totalDep,
      revenus: totalRev,
      depenses: totalDep,
      detailsReservations: reservations // Donne le compte par statut (confirmé, attente, etc.)
    };
  },

  /**
   * Obtenir le solde d'un hôtel
   */
  async getSolde(hotelId: number): Promise<number> {
    try {
      const revenusResult = await prisma.caisse.aggregate({
        where: {
          hotelId,
          type: "revenus",
          statut: "validée",
        },
        _sum: { montant: true },
      });

      const depensesResult = await prisma.caisse.aggregate({
        where: {
          hotelId,
          type: "dépenses",
          statut: "validée",
        },
        _sum: { montant: true },
      });

      const totalRevenus = revenusResult._sum.montant || 0;
      const totalDépenses = depensesResult._sum.montant || 0;

      return totalRevenus - totalDépenses;
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
      throw error;
    }
  },

  /**
   * Obtenir les revenus des réservations confirmées
   */
  async getRevenusReservations(hotelId: number): Promise<number> {
    try {
      const result = await prisma.reservation.aggregate({
        where: {
          hotelId,
          statut: "confirmée",
        },
        _sum: { montantTotal: true },
      });

      return result._sum.montantTotal || 0;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des revenus des réservations:",
        error
      );
      throw error;
    }
  },

  // Gestion des depenses
  async creerDepense(data: { hotelId: number, montant: number, description: string, utilisateurId: number, justificatifUrl?: string }) {
    return await prisma.caisse.create({
      data: {
        type: "dépenses",
        description: data.description,
        montant: data.montant,
        statut: "validée",
        hotelId: data.hotelId,
        utilisateurId: data.utilisateurId,
        creePar: data.utilisateurId,
        justificatifUrl: data.justificatifUrl
      }
    });
  },

  /**
   * Récupérer une entrée de caisse
   */
  async getEntree(caisseId: number): Promise<EntreeCaisse | null> {
    try {
      const entree = await prisma.caisse.findUnique({
        where: { idCaisse: caisseId },
      });

      return entree as unknown as EntreeCaisse | null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'entrée:", error);
      throw error;
    }
  },

  /**
   * Mettre à jour une entrée de caisse
   */
  async mettreAJourEntree(
    caisseId: number,
    data: Partial<EntreeCaisseRequest>
  ): Promise<EntreeCaisse> {
    try {
      const entree = await prisma.caisse.findUnique({
        where: { idCaisse: caisseId },
      });

      if (!entree) {
        throw new Error("Entrée de caisse non trouvée");
      }

      const updated = await prisma.caisse.update({
        where: { idCaisse: caisseId },
        data: {
          description: data.description || entree.description,
          montant: data.montant || entree.montant,
          justificatifUrl:
            data.justificatifUrl || entree.justificatifUrl,
        },
      });

      return updated as unknown as EntreeCaisse;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entrée:", error);
      throw error;
    }
  },

  /**
   * Supprimer une entrée de caisse
   */
  async supprimerEntree(caisseId: number): Promise<void> {
    try {
      const entree = await prisma.caisse.findUnique({
        where: { idCaisse: caisseId },
      });

      if (!entree) {
        throw new Error("Entrée de caisse non trouvée");
      }

      await prisma.caisse.delete({
        where: { idCaisse: caisseId },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entrée:", error);
      throw error;
    }
  },

  /**
   * Générer un rapport de caisse par période
   */
  async getRapportCaisse(
    hotelId: number,
    dateDebut: Date,
    dateFin: Date
  ): Promise<any> {
    try {
      // Revenus par type
      const revenusParType = await prisma.caisse.groupBy({
        by: ["type"],
        where: {
          hotelId,
          type: "revenus",
          creeLe: {
            gte: dateDebut,
            lte: dateFin,
          },
          statut: "validée",
        },
        _sum: { montant: true },
      });

      // Dépenses par type
      const depensesParType = await prisma.caisse.groupBy({
        by: ["type"],
        where: {
          hotelId,
          type: "dépenses",
          creeLe: {
            gte: dateDebut,
            lte: dateFin,
          },
          statut: "validée",
        },
        _sum: { montant: true },
      });

      // Réservations confirmées
      const reservationResult = await prisma.reservation.aggregate({
        where: {
          hotelId,
          statut: "confirmée",
          dateArrivee: {
            gte: dateDebut,
          },
          dateDepart: {
            lte: dateFin,
          },
        },
        _sum: { montantTotal: true },
        _count: true,
      });

      // Factures payées
      const facturesResult = await prisma.facture.aggregate({
        where: {
          hotelId,
          statut: "payée",
          creeLe: {
            gte: dateDebut,
            lte: dateFin,
          },
        },
        _sum: { montantTTC: true },
        _count: true,
      });

      const totalRevenus = revenusParType.reduce(
        (sum, item) => sum + (item._sum.montant || 0),
        0
      );
      const totalDépenses = depensesParType.reduce(
        (sum, item) => sum + (item._sum.montant || 0),
        0
      );

      return {
        periode: {
          debut: dateDebut.toISOString().split("T")[0],
          fin: dateFin.toISOString().split("T")[0],
        },
        revenus: {
          total: totalRevenus,
          parType: revenusParType,
        },
        depenses: {
          total: totalDépenses,
          parType: depensesParType,
        },
        reservations: {
          nombre: reservationResult._count,
          montantTotal: reservationResult._sum.montantTotal || 0,
        },
        factures: {
          nombre: facturesResult._count,
          montantTotal: facturesResult._sum.montantTTC || 0,
        },
        solde: totalRevenus - totalDépenses,
      };
    } catch (error) {
      console.error("Erreur lors de la génération du rapport de caisse:", error);
      throw error;
    }
  },

  /**
   * Obtenir un tableau de bord caisse pour le chef hôtel
   */
  async getDashboardCaisse(hotelId: number): Promise<any> {
    try {
      const stats = await this.getStatistiquesHotel(hotelId);
      const dernieres_entrees = await this.getEntreesHotel(hotelId, undefined, 10);

      // Réservations en attente
      const reservationsEnAttente = await prisma.reservation.findMany({
        where: {
          hotelId,
          statut: "en_attente",
        },
        select: {
          idReservation: true,
          montantTotal: true,
          client: {
            select: {
              prenom: true,
              nom: true,
            },
          },
          chambre: {
            select: {
              nom: true,
            },
          },
        },
        orderBy: { creeLe: "desc" },
        take: 5,
      });

      // Factures non payées
      const facturesNonPayees = await prisma.facture.findMany({
        where: {
          hotelId,
          statut: { not: "payée" },
        },
        select: {
          idFacture: true,
          numeroFacture: true,
          montantTTC: true,
          client: {
            select: {
              prenom: true,
              nom: true,
            },
          },
        },
        orderBy: { creeLe: "desc" },
        take: 5,
      });

      return {
        statistiques: stats,
        dernieres_entrees,
        reservations_en_attente: {
          nombre: reservationsEnAttente.length,
          montantTotal: reservationsEnAttente.reduce(
            (sum, res) => sum + res.montantTotal,
            0
          ),
          reservations: reservationsEnAttente,
        },
        factures_non_payees: {
          nombre: facturesNonPayees.length,
          montantTotal: facturesNonPayees.reduce(
            (sum, fac) => sum + fac.montantTTC,
            0
          ),
          factures: facturesNonPayees,
        },
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du dashboard caisse:", error);
      throw error;
    }
  },
};
