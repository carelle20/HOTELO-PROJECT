import prisma from "../prisma/client";
import {
  CreateReservationRequest,
  Reservation,
  ReservationResponse,
  StatutReservation,
  DisponibiliteChambre,
  ReponseDisponibilite,
} from "../interfaces/reservation.interface";

export const reservationService = {

  /* Créer une nouvelle réservation */
  async createReservation(clientId: number, data: CreateReservationRequest): Promise<ReservationResponse> {
    return await prisma.$transaction(async (tx) => {
      // Validation des dates
      const dateArrivee = new Date(data.dateArrivee);
      const dateDepart = new Date(data.dateDepart);
      if (dateArrivee <= new Date()) throw new Error("Date d'arrivée invalide");
      // Vérifier la disponibilité
      // On vérifie s'il existe déjà une réservation CONFIRMÉE ou EN ATTENTE sur ces dates
      const conflit = await tx.reservation.findFirst({
        where: {
          chambreId: data.chambreId,
          statut: { in: ["confirmée", "en_attente"] },
          AND: [
            { dateArrivee: { lt: dateDepart } },
            { dateDepart: { gt: dateArrivee } }
          ]
        }
      });
      if (conflit) throw new Error("La chambre est déjà occupée sur cette période");
      // Récupération des infos prix
      const chambre = await tx.chambre.findUnique({ where: { idChambre: data.chambreId } });
      if (!chambre) throw new Error("Chambre non trouvée");
      const diffTime = Math.abs(dateDepart.getTime() - dateArrivee.getTime());
      const nombreNuits = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const montantTotal = nombreNuits * chambre.prix;
      // Création de la réservation
      const reservation = await tx.reservation.create({
        data: {
          dateArrivee,
          dateDepart,
          nombreNuits,
          nombrePersonnes: data.nombrePersonnes,
          statut: "en_attente",
          prixUnitaire: chambre.prix,
          montantTotal,
          clientId,
          chambreId: data.chambreId,
          hotelId: data.hotelId,
        }
      });
      // 5. Bloquer les dates dans DisponibiliteChambre
      const dates = [];
      let current = new Date(dateArrivee);
      while (current < dateDepart) {
        dates.push({
          date: new Date(current),
          disponible: false,
          raison: "Réservation en cours",
          chambreId: data.chambreId,
          hotelId: data.hotelId,
          reservationId: reservation.idReservation
        });
        current.setDate(current.getDate() + 1);
      }
      await tx.disponibiliteChambre.createMany({ data: dates });
      return reservation;
    }, {
      isolationLevel: "Serializable" // Pour éviter les accès simultanés
    });
  },

  /* Récupérer toutes les réservations d'un client */
  async getClientReservations(clientId: number): Promise<Reservation[]> {
    try {
      const reservations = await prisma.reservation.findMany({
        where: { clientId },
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
          factures: true,
        },
        orderBy: { dateArrivee: "desc" },
      });

      return reservations as unknown as Reservation[];
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      throw error;
    }
  },

  /* Récupérer une réservation spécifique */
  async getReservationById(
    reservationId: number,
    clientId?: number
  ): Promise<Reservation | null> {
    try {
      const where: any = { idReservation: reservationId };
      if (clientId) {
        where.clientId = clientId;
      }

      const reservation = await prisma.reservation.findFirst({
        where,
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
          factures: true,
        },
      });

      return reservation as unknown as Reservation | null;
    } catch (error) {
      console.error("Erreur lors de la récupération de la réservation:", error);
      throw error;
    }
  },

  /* Annuler une réservation */
  async cancelReservation(reservationId: number, clientId: number) {
    return await prisma.$transaction(async (tx) => {
      const res = await tx.reservation.findFirst({ 
        where: { idReservation: reservationId, clientId } 
      });
      if (!res) throw new Error("Réservation introuvable");

      // On ne supprime QUE les disponibilités liées à CETTE réservation
      await tx.disponibiliteChambre.deleteMany({
        where: { reservationId: reservationId }
      });

      return await tx.reservation.update({
        where: { idReservation: reservationId },
        data: { statut: "annulée" }
      });
    });
  },

  /* Mettre à jour une réservation */
  async updateReservation(id: number, data: Partial<Reservation>): Promise<Reservation> {
    try {     
      // 1. On nettoie les données pour éviter les champs non modifiables
      const { 
        idReservation, 
        hotel, 
        chambre, 
        client, 
        factures, 
        creeLe, 
        ...cleanData 
      } = data;
      // 2. On effectue l'update sur Prisma
      const updated = await prisma.reservation.update({
        where: { idReservation: id },
        data: {
          ...cleanData,
          // On s'assure que les dates sont au bon format Date pour Prisma
          dateArrivee: data.dateArrivee ? new Date(data.dateArrivee) : undefined,
          dateDepart: data.dateDepart ? new Date(data.dateDepart) : undefined,
          misAJourLe: new Date(), // On utilise un objet Date natif
        },
        include: {
          hotel: true,
          chambre: true,
        },
      });
      return updated as any as Reservation;
    } catch (error: any) {
      console.error("Erreur Prisma Update:", error);
      throw new Error(error.message || "Erreur lors de la mise à jour");
    }
  },

  /**
   * Confirmer une réservation (par le chef hôtel)
   */
  async confirmerReservation(
    reservationId: number,
    chefHotelId: number
  ): Promise<Reservation | null> {
    try {
      // Vérifier que la réservation appartient à l'hôtel du chef
      const reservation = await prisma.reservation.findUnique({
        where: { idReservation: reservationId },
        include: { hotel: true },
      });

      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }

      if (reservation.hotel.chefHotelId !== chefHotelId) {
        throw new Error("Accès non autorisé à cette réservation");
      }

      // Mettre à jour le statut
      const updated = await prisma.reservation.update({
        where: { idReservation: reservationId },
        data: { statut: "confirmée" },
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
          factures: true,
        },
      });

      return updated as unknown as Reservation;
    } catch (error) {
      console.error(
        "Erreur lors de la confirmation de la réservation:",
        error
      );
      throw error;
    }
  },

  /**
   * Refuser une réservation (par le chef hôtel)
   */
  async refuserReservation(
    reservationId: number,
    chefHotelId: number,
    motif: string
  ): Promise<Reservation | null> {
    try {
      // Vérifier que la réservation appartient à l'hôtel du chef
      const reservation = await prisma.reservation.findUnique({
        where: { idReservation: reservationId },
        include: { hotel: true },
      });

      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }

      if (reservation.hotel.chefHotelId !== chefHotelId) {
        throw new Error("Accès non autorisé à cette réservation");
      }

      // Mettre à jour le statut
      const updated = await prisma.reservation.update({
        where: { idReservation: reservationId },
        data: {
          statut: "annulée",
          motifAnnulation: motif,
        },
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
          factures: true,
        },
      });

      // Libérer les disponibilités
      await prisma.disponibiliteChambre.updateMany({
        where: {
          reservationId: reservationId,
        },
        data: {
          disponible: true,
          raison: "Réservation refusée",
        },
      });

      return updated as unknown as Reservation;
    } catch (error) {
      console.error("Erreur lors du refus de la réservation:", error);
      throw error;
    }
  },

  // ========== DISPONIBILITÉ ==========

  /**
   * Vérifier la disponibilité d'une chambre
   */
  async verifierDisponibilite(
    chambreId: number,
    dateArrivee: string,
    dateDepart: string
  ): Promise<ReponseDisponibilite> {
    try {
      const debut = new Date(dateArrivee);
      const fin = new Date(dateDepart);

      // Récupérer la chambre
      const chambre = await prisma.chambre.findUnique({
        where: { idChambre: chambreId },
        include: { hotel: true },
      });

      if (!chambre) {
        return {
          chambreId,
          chambreName: "Inconnue",
          dateArrivee,
          dateDepart,
          disponible: false,
          raisons: ["Chambre non trouvée"],
          nuitsSansDisponibilite: [],
        };
      }

      // Vérifier les disponibilités par date
      const unavailableDates = await prisma.disponibiliteChambre.findMany({
        where: {
          chambreId,
          date: {
            gte: debut,
            lt: fin,
          },
          disponible: false,
        },
        select: { date: true, raison: true },
      });

      const raisons = new Set<string>();
      const nuitsSansDisponibilite: string[] = [];

      unavailableDates.forEach((d) => {
        nuitsSansDisponibilite.push(d.date.toISOString().split("T")[0]);
        if (d.raison) raisons.add(d.raison);
      });

      // Vérifier aussi les réservations confirmées
      const reservations = await prisma.reservation.findMany({
        where: {
          chambreId,
          statut: { in: ["confirmée", "en_attente"] },
          dateArrivee: { lt: fin },
          dateDepart: { gt: debut },
        },
      });

      if (reservations.length > 0) {
        raisons.add("Chambre réservée");
        reservations.forEach((res) => {
          const dateIterator = new Date(res.dateArrivee);
          while (dateIterator < res.dateDepart) {
            nuitsSansDisponibilite.push(
              dateIterator.toISOString().split("T")[0]
            );
            dateIterator.setDate(dateIterator.getDate() + 1);
          }
        });
      }

      return {
        chambreId,
        chambreName: chambre.nom,
        dateArrivee,
        dateDepart,
        disponible: unavailableDates.length === 0 && reservations.length === 0,
        raisons: Array.from(raisons),
        nuitsSansDisponibilite: [...new Set(nuitsSansDisponibilite)].sort(),
      };
    } catch (error) {
      console.error("Erreur lors de la vérification de disponibilité:", error);
      throw error;
    }
  },

  /**
   * Créer les entrées de disponibilité pour une période
   */
  async creerDisponibilites(
    chambreId: number,
    hotelId: number,
    dateArrivee: Date,
    dateDepart: Date,
    reservationId: number,
    disponible: boolean
  ): Promise<void> {
    try {
      const dates: any[] = [];
      const dateIterator = new Date(dateArrivee);

      while (dateIterator < dateDepart) {
        dates.push({
          date: new Date(dateIterator),
          disponible,
          raison: disponible ? null : "Chambre réservée",
          chambreId,
          hotelId,
          reservationId,
        });
        dateIterator.setDate(dateIterator.getDate() + 1);
      }

      if (dates.length > 0) {
        await prisma.disponibiliteChambre.createMany({
          data: dates,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création des disponibilités:", error);
      throw error;
    }
  },

  /**
   * Récupérer les réservations en attente pour un hôtel
   */
  async getReservationsEnAttente(hotelId: number): Promise<Reservation[]> {
    try {
      return (await prisma.reservation.findMany({
        where: {
          hotelId,
          statut: "en_attente",
        },
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
          factures: true,
        },
        orderBy: { creeLe: "desc" },
      })) as unknown as Reservation[];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des réservations en attente:",
        error
      );
      throw error;
    }
  },

  /**
   * Récupérer les réservations confirmées pour un hôtel
   */
  async getReservationsConfirmees(hotelId: number): Promise<Reservation[]> {
    try {
      return (await prisma.reservation.findMany({
        where: {
          hotelId,
          statut: "confirmée",
        },
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
          factures: true,
        },
        orderBy: { dateArrivee: "asc" },
      })) as unknown as Reservation[];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des réservations confirmées:",
        error
      );
      throw error;
    }
  },

  /**
   * Obtenir les statistiques de réservations
   */
  async getStatsReservations(
    hotelId: number,
    mois?: number,
    annee?: number
  ): Promise<any> {
    try {
      const total = await prisma.reservation.count({
        where: { hotelId },
      });

      const confirmees = await prisma.reservation.count({
        where: {
          hotelId,
          statut: "confirmée",
        },
      });

      const montantTotal = await prisma.reservation.aggregate({
        where: { hotelId, statut: "confirmée" },
        _sum: { montantTotal: true },
      });

      const taux_occupation = confirmees > 0 ? (confirmees / total) * 100 : 0;

      return {
        total,
        confirmees,
        montantTotal: montantTotal._sum.montantTotal || 0,
        taux_occupation: Math.round(taux_occupation),
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques:",
        error
      );
      throw error;
    }
  },
};
