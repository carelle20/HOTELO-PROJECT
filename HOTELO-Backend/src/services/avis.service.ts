import prisma from "../prisma/client";
import { Avis, AvisRequest } from "../interfaces/reservation.interface";

export const avisService = {
  /* Créer un nouvel avis */
  async creerAvis(clientId: number, data: AvisRequest): Promise<Avis> {
    if (data.reservationId) {
      const avisExistant = await prisma.avis.findFirst({
        where: { reservationId: data.reservationId }
      });
      if (avisExistant) throw new Error("Vous avez déjà laissé un avis pour ce séjour");
    }
    return await prisma.avis.create({
      data: { ...data, clientId, estModere: true },
      include: { client: true }
    }) as unknown as Avis;
  },

  /* Récupérer les avis d'un client */
  async getAvisClient(clientId: number): Promise<Avis[]> {
    try {
      const avis = await prisma.avis.findMany({
        where: { clientId },
        include: {
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
            },
          },
          hotel: {
            select: {
              idHotel: true,
              nom: true,
            },
          },
          reservation: {
            select: {
              idReservation: true,
              dateArrivee: true,
              dateDepart: true,
            },
          },
        },
        orderBy: { creeLe: "desc" },
      });

      return avis as unknown as Avis[];
    } catch (error) {
      console.error("Erreur lors de la récupération des avis du client:", error);
      throw error;
    }
  },

  /* Récupérer les avis d'un hôtel */
  async getAvisHotel(hotelId: number, estModere = true): Promise<Avis[]> {
    try {
      const avis = await prisma.avis.findMany({
        where: {
          hotelId,
          estModere,
        },
        include: {
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
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

      return avis as unknown as Avis[];
    } catch (error) {
      console.error("Erreur lors de la récupération des avis de l'hôtel:", error);
      throw error;
    }
  },

  /* Récupérer un avis spécifique */
  async getAvisById(avisId: number): Promise<Avis | null> {
    try {
      const avis = await prisma.avis.findUnique({
        where: { idAvis: avisId },
        include: {
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
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

      return avis as unknown as Avis | null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'avis:", error);
      throw error;
    }
  },

  /* Mettre à jour un avis */
  async mettreAJourAvis(
    avisId: number,
    clientId: number,
    data: Partial<AvisRequest>
  ): Promise<Avis> {
    try {
      const avis = await prisma.avis.findUnique({
        where: { idAvis: avisId },
      });

      if (!avis || avis.clientId !== clientId) {
        throw new Error("Avis non trouvé ou accès non autorisé");
      }
      // Valider la note si fournie
      if (data.note && (data.note < 1 || data.note > 5)) {
        throw new Error("La note doit être entre 1 et 5");
      }
      // Mettre à jour
      const updated = await prisma.avis.update({
        where: { idAvis: avisId },
        data: {
          titre: data.titre ?? avis.titre,
          commentaire: data.commentaire ?? avis.commentaire,
          note: data.note ?? avis.note,
        },
        include: {
          client: {
            select: {
              idUtilisateur: true,
              prenom: true,
              nom: true,
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

      return updated as unknown as Avis;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avis:", error);
      throw error;
    }
  },

  /* Supprimer un avis */
  async supprimerAvis(avisId: number, clientId: number): Promise<void> {
    try {
      // Vérifier que l'avis appartient au client
      const avis = await prisma.avis.findUnique({
        where: { idAvis: avisId },
      });

      if (!avis || avis.clientId !== clientId) {
        throw new Error("Avis non trouvé ou accès non autorisé");
      }

      await prisma.avis.delete({
        where: { idAvis: avisId },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis:", error);
      throw error;
    }
  },

  /* Obtenir les statistiques d'avis pour un hôtel */
  async getStatsAvis(hotelId: number): Promise<any> {
    try {
      // 1. Sécurité : Conversion forcée en entier pour Prisma
      const id = Number(hotelId);

      // Si l'ID n'est pas un nombre valide, on retourne des stats vides au lieu de faire planter le serveur (Erreur 500)
      if (isNaN(id)) {
        return {
          total: 0,
          noteMoyenne: 0,
          distribution: { "5-etoiles": 0, "4-etoiles": 0, "3-etoiles": 0, "2-etoiles": 0, "1-etoile": 0 },
        };
      }

      // 2. Récupération du nombre total d'avis
      const total = await prisma.avis.count({
        where: { hotelId: id },
      });

      // 3. Récupération de toutes les notes pour la moyenne et la distribution
      const avisHotel = await prisma.avis.findMany({
        where: { hotelId: id },
        select: { note: true },
      });

      // 4. Calcul de la note moyenne
      const noteMoyenne =
        avisHotel.length > 0
          ? parseFloat((avisHotel.reduce((sum, a) => sum + a.note, 0) / avisHotel.length).toFixed(2))
          : 0;

      // 5. Initialisation et calcul de la distribution
      const distribution = {
        "5-etoiles": 0,
        "4-etoiles": 0,
        "3-etoiles": 0,
        "2-etoiles": 0,
        "1-etoile": 0,
      };

      avisHotel.forEach((a) => {
        const key = `${a.note}${a.note > 1 ? "-etoiles" : "-etoile"}`;
        if (distribution.hasOwnProperty(key)) {
          // @ts-ignore : pour éviter les erreurs de mapping de clés dynamiques
          distribution[key]++;
        }
      });

      // 6. Retour des données au format attendu par le Dashboard
      return {
        total,
        noteMoyenne,
        distribution,
      };
    } catch (error) {
      // Log précis pour le terminal
      console.error(`[AvisService] Erreur stats pour hotelId ${hotelId}:`, error);
      throw error;
    }
  },

};
