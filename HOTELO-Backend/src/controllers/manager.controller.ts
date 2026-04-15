// backend/src/controllers/manager.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ManagerService } from "../services/manager.service";
import { reservationService } from "../services/reservation.service";
import { factureService } from "../services/facture.service";
import { caisseService } from "../services/caisse.service";
import { avisService } from "../services/avis.service";
import { CreateChambre, CreateHotel } from "../interfaces/manager.interface";

export const ManagerController = {

  // fonction de creation d'un hotel
  async createHotel(req: AuthRequest, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Le corps de la requête est vide." });
      }
      const chefHotelId = req.user!.id; 
      let files: Express.Multer.File[] = [];
      if (Array.isArray(req.files)) {
        files = req.files;
      }else if (req.files && typeof req.files === 'object') {
        files = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'] || [];
      }
      if (!files || files.length < 3) {
        return res.status(400).json({ message: "Veuillez uploader au moins 3 images." });
      }
      const hotelData = {
        ...req.body,
        latitude: parseFloat(req.body.latitude) || 0,
        longitude: parseFloat(req.body.longitude) || 0,
        telephone: req.body.telephone,
        email: req.body.email || null,
        nombreChambres: parseInt(req.body.nombreChambres) || 0,
        prixMin: parseFloat(req.body.prixMin) || 0,
        prixMax: parseFloat(req.body.prixMax) || 0,
        numeroRegistre: req.body.numeroRegistre,
        // On parse les strings JSON en tableaux d'entiers
        equipementsIds: JSON.parse(req.body.equipementsIds || "[]"),
        servicesIds: JSON.parse(req.body.servicesIds || "[]")
      };

      const images = files.map((file,index) => ({
        url: `/uploads/hotels/${file.filename}`,
        estPrincipale: index === 0 // La première image est considérée comme principale
      }));
      const hotel = await ManagerService.createHotel(hotelData, chefHotelId, images);

      res.status(201).json(hotel);
    } catch (error: any) {
      console.error("Erreur creation hotel", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // fonction de recuperation d'un hotel par son id
  async getHotelById(req: AuthRequest, res: Response) {
    try {
      const idHotel = Number(req.params.idHotel);
      const hotel = await ManagerService.getHotelById(idHotel);
      if (!hotel) return res.status(404).json({ message: "Hôtel non trouvé" });
      return res.json(hotel);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // fonction de modification d'un hotel
  async updateHotel(req: AuthRequest, res: Response) {
    try {
      const idHotel = Number(req.params.idHotel);
      const chefHotelId = req.user!.id;

      if (!chefHotelId || isNaN(idHotel)) {
        return res.status(400).json({ message: "Requête invalide" });
      }
      const raw = req.body;
      // Transformer les IDs en tableau de numbres
      const formatIds = (val: string | string[] | undefined): number[] => {
        if (!val) return [];
        const array = Array.isArray(val) ? val : [val];
        return array.map((v) => Number(v)).filter((n) => !isNaN(n));
      };
      const hotelData: Partial<CreateHotel> = {
        nom: raw.nom,
        description: raw.description,
        pays: raw.pays,
        ville: raw.ville,
        adresse: raw.adresse,
        latitude: raw.latitude ? Number(raw.latitude) : undefined,
        longitude: raw.longitude ? Number(raw.longitude) : undefined,
        nombreChambres: raw.nombreChambres ? Number(raw.nombreChambres) : undefined,
        prixMin: raw.prixMin ? Number(raw.prixMin) : undefined,
        prixMax: raw.prixMax ? Number(raw.prixMax) : undefined,
        equipementsIds: formatIds(raw.equipementsIds),
        servicesIds: formatIds(raw.servicesIds),
      };
      const result = await ManagerService.updateHotel(idHotel, chefHotelId, hotelData);
      return res.status(200).json({ message: "Succès", data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      return res.status(500).json({ error: message });
    }
  },

  // fonction de recuperation de la liste des hotels du chef connecté
  async getMyHotels(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      const hotels = await ManagerService.getMyHotels(req.user!.id);
      const data = hotels.map(h => ({...h}));
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ message: "Erreur récupération", error: error.message });
    }
  },

  // fonction de creation d'une chambre
  async addChambre(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.idHotel);
      const chefHotelId = req.user!.id;
      if (!chefHotelId || isNaN(hotelId)) {
        return res.status(400).json({ message: "Requête invalide" });
      }
      const files = req.files as Express.Multer.File[];
      if (!files || files.length < 3) {
        return res.status(400).json({ message: "Veuillez uploader au moins 3 images pour la chambre." });
      }

      const { nom, description, capacite, prix } = req.body; 
      const chambreData: CreateChambre = {
        nom,
        description,
        capacite: Number(capacite),
        prix: Number(prix)
      };

      const imageUrls = files.map(file => `/uploads/chambres/${file.filename}`);

      const result = await ManagerService.createChambre(hotelId, chambreData, imageUrls);

      return res.status(201).json({ message: "Chambre créée avec succès", data: result });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur lors de la création";
      return res.status(500).json({ error: msg });
    }
  },

  // fonction de recuperation de la liste des chambres d'un hotel
  async getChambres(req: AuthRequest, res: Response) {
    try {
      const { idHotel } = req.params;
      const chefHotelId = req.user!.id;
      const chambres = await ManagerService.getChambres(Number(idHotel), Number(chefHotelId));
      res.json(chambres);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération chambres" });
    }
  },

  // fonction d'upload d'une image pour un hotel
  async uploadHotelImages(req: AuthRequest, res: Response) {
    try {
      const { idHotel } = req.params;
      const hotelIdNum = Number(idHotel);
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Aucun fichier envoyé" });
      }
      const savedImages = await ManagerService.addHotelImages(hotelIdNum, files);
      return res.status(201).json(savedImages);
      
    } catch (error) {
      console.error("Erreur Controller Upload:", error);
      return res.status(500).json({ message: "Erreur lors du traitement des images" });
    }
  },

  // fonction de recuperation de la liste des équipements et services
  async getCatalogues(req: AuthRequest, res: Response) {
    try {
      const data = await ManagerService.getCatalogues();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Erreur catalogue" });
    }
  },

  // fonction d'assignation des équipements et services à un hotel
  async setHotelCatalog(req: AuthRequest, res: Response) {
    try {
      const { idHotel } = req.params;
      const { equipementIds, serviceIds } = req.body;
      
      await ManagerService.updateHotelCatalog(
        Number(idHotel), 
        req.user!.id, 
        equipementIds, 
        serviceIds
      ); 
      res.json({ message: "Équipements et services mis à jour" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /* fonction de recuperation des réservations en attente de l'hôtel */
  async getPendingReservations(req: AuthRequest, res: Response) {
    try {
      const chefHotelId = req.user?.id;
      if (!chefHotelId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const hotelId = Number(req.params.hotelId);
      const reservations = await reservationService.getReservationsEnAttente(hotelId);
      return res.status(200).json({success: true, data: reservations});
    } catch (error: unknown) {
      console.error("Erreur getPendingReservations:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Confirmer une réservation */
  async confirmReservation(req: AuthRequest, res: Response) {
    try {
      const chefHotelId = req.user?.id;
      if (!chefHotelId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const { id } = req.params;
      const reservation = await reservationService.confirmerReservation(Number(id), chefHotelId);
      if (reservation) {
        await caisseService.creerEntree({
          type: "revenus",
          description: `Paiement Réservation #${reservation.idReservation} - Client: ${reservation.client?.prenom} ${reservation.client?.nom}`,
          montant: reservation.montantTotal,
          hotelId: reservation.hotelId,
          reservationId: reservation.idReservation,
        });
      }
      return res.status(200).json({success: true, message: "Réservation confirmée", data: reservation,});
    } catch (error: unknown) {
      console.error("Erreur confirmReservation:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ success: false, message });
    }
  },

  /* Refuser une réservation */
  async rejectReservation(req: AuthRequest, res: Response) {
    try {
      const chefHotelId = req.user?.id;
      if (!chefHotelId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const { id } = req.params;
      const { motif } = req.body;
      if (!motif) {
        return res.status(400).json({ message: "Le motif du refus est requis" });
      }
      const reservation = await reservationService.refuserReservation(Number(id), chefHotelId, motif);
      return res.status(200).json({success: true, message: "Réservation refusée", data: reservation,});
    } catch (error: unknown) {
      console.error("Erreur rejectReservation:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ success: false, message });
    }
  },

  /* Récupérer les réservations confirmées */
  async getConfirmedReservations(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const reservations = await reservationService.getReservationsConfirmees(
        hotelId
      );
      return res.status(200).json({success: true, data: reservations,});
    } catch (error: unknown) {
      console.error("Erreur getConfirmedReservations:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ success: false, message });
    }
  },

  /* Récupérer les factures de l'hôtel */
  async getHotelInvoices(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const factures = await factureService.getFacturesHotel(hotelId);
      return res.status(200).json({success: true, data: factures,});
    } catch (error: unknown) {
      console.error("Erreur getHotelInvoices:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ success: false, message });
    }
  },

  /* Confirmer le paiement d'une facture */
  async confirmInvoicePayment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { methodePaiement } = req.body;
      if (!methodePaiement) {
        return res.status(400).json({ message: "La méthode de paiement est requise" });
      }
      const facture = await factureService.confirmerPaiement(
        Number(id),
        methodePaiement,
        req.user!.id
      );

      return res.status(200).json({
        success: true,
        message: "Paiement confirmé",
        data: facture,
      });
    } catch (error: unknown) {
      console.error("Erreur confirmInvoicePayment:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les statistiques de facturation */
  async getInvoiceStats(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const stats = await factureService.getStatsFacturation(hotelId);
      return res.status(200).json({success: true, data: stats,});
    } catch (error: unknown) {
      console.error("Erreur getInvoiceStats:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer le dashboard de caisse */
  async getCaisseDashboard(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const dashboard = await caisseService.getDashboardCaisse(hotelId);
      return res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error: unknown) {
      console.error("Erreur getCaisseDashboard:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Créer une entrée de caisse */
  async createCaisseEntry(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const chefHotelId = req.user?.id;
      if (!chefHotelId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const data = {
        ...req.body,
        hotelId,
        creePar: chefHotelId,
      };
      const entry = await caisseService.creerEntree(data);
      return res.status(201).json({success: true, message: "Entrée de caisse créée", data: entry,});
    } catch (error: unknown) {
      console.error("Erreur createCasseEntry:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les entrées de caisse */
  async getCaisseEntries(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const { type, limit } = req.query;
      const entries = await caisseService.getEntreesHotel(
        hotelId,
        type as any,
        limit ? Number(limit) : 50
      );
      return res.status(200).json({
        success: true,
        data: entries,
      });
    } catch (error: unknown) {
      console.error("Erreur getCasseEntries:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les statistiques de caisse */
  async getCaisseStats(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const stats = await caisseService.getStatistiquesHotel(hotelId);
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: unknown) {
      console.error("Erreur getCasseStats:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Générer un rapport de caisse*/
  async getCaisseReport(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const { dateDebut, dateFin } = req.query;
      if (!dateDebut || !dateFin) {
        return res.status(400).json({
          message: "Les paramètres dateDebut et dateFin sont requis",
        });
      }
      const rapport = await caisseService.getRapportCaisse(
        hotelId,
        new Date(dateDebut as string),
        new Date(dateFin as string)
      );
      return res.status(200).json({
        success: true,
        data: rapport,
      });
    } catch (error: unknown) {
      console.error("Erreur getCasseReport:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les avis de l'hôtel */
  async getHotelReviews(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const avis = await avisService.getAvisHotel(hotelId);
      return res.status(200).json({
        success: true,
        data: avis,
      });
    } catch (error: unknown) {
      console.error("Erreur getHotelReviews:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les statistiques d'avis */
  async getReviewStats(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const stats = await avisService.getStatsAvis(hotelId);
      return res.status(200).json({success: true, data: stats});
    } catch (error: unknown) {
      console.error("Erreur getReviewStats:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les statistiques de réservation */
  async getReservationStats(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      const stats = await reservationService.getStatsReservations(hotelId);
      return res.status(200).json({success: true, data: stats});
    } catch (error: unknown) {
      console.error("Erreur getReservationStats:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Dashboard générique pour tous les hôtels du chef hôtel */
  async getDashboardGeneral(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const chefHotelId = req.user.id;
      
      // Récupérer tous les hôtels du chef
      const hotels = await ManagerService.getMyHotels(chefHotelId);
      
      if (!hotels || hotels.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            totalReservations: 0,
            totalRevenusJour: 0,
            totalPaiements: 0,
            satisfactionMoyenne: 0,
            reservationsEnAttente: [],
            dernieresMaj: new Date(),
            missingImages: false,
            missingRooms: false,
            missing3DVisit: false,
            qualityScore: 0,
          },
        });
      }
      
      const hotelIds = hotels.map(h => h.idHotel);
      const statsPromises = hotelIds.map(hotelId => 
        Promise.all([
          reservationService.getStatsReservations(hotelId).catch(() => ({ totalReservations: 0, confirmees: 0, pending: 0 })),
          caisseService.getStatistiquesHotel(hotelId).catch(() => ({ solde: 0, revenus: 0, depenses: 0, detailsReservations: [] })),
          reservationService.getReservationsEnAttente(hotelId).catch(() => []),
        ])
      );
      
      const allStats = await Promise.all(statsPromises);
      
      // Agréger les stats
      let totalReservations = 0;
      let totalRevenusJour = 0;
      const allPendingReservations: any[] = [];
      
      allStats.forEach(([reservStats, caisseStats, pendingRes]) => {
        totalReservations += reservStats.totalReservations || 0;
        totalRevenusJour += caisseStats.revenus || 0;
        allPendingReservations.push(...(pendingRes || []));
      });
      
      return res.status(200).json({
        success: true,
        data: {
          totalReservations,
          totalRevenusJour,
          totalPaiements: totalRevenusJour,
          satisfactionMoyenne: 4.5,
          reservationsEnAttente: allPendingReservations.slice(0, 5),
          dernieresMaj: new Date(),
          missingImages: hotels.some(h => !h.images || h.images.length === 0),
          missingRooms: hotels.some(h => !h.nombreChambres || h.nombreChambres === 0),
          missing3DVisit: false,
          qualityScore: 75,
        },
      });
    } catch (error: unknown) {
      console.error("Erreur getDashboardGeneral:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  },

  /* Récupérer les réservations en attente pour tous les hôtels du chef */
  async getAllPendingReservations(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const chefHotelId = req.user.id;     
      // Récupérer tous les hôtels du chef
      const hotels = await ManagerService.getMyHotels(chefHotelId);
      
      if (!hotels || hotels.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }
      
      // Récupérer les réservations en attente pour chaque hôtel
      const hotelIds = hotels.map(h => h.idHotel);
      const reservationsPromises = hotelIds.map(hotelId => 
        reservationService.getReservationsEnAttente(hotelId).catch(() => [])
      );
      
      const allReservations = await Promise.all(reservationsPromises);
      const flatReservations = allReservations.flat();
      
      return res.status(200).json({
        success: true,
        data: flatReservations,
      });
    } catch (error: unknown) {
      console.error("Erreur getAllPendingReservations:", error);
      const message = error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ success: false, message });
    }
  },

  /* Dashboard complet du chef hôtel */
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const hotelId = Number(req.params.hotelId);
      // Récupérer toutes les données
      const [
        reservationStats,
        caisseStats,
        facturationStats,
        avisStats,
        reservationsEnAttente,
        caisseInfo,
      ] = await Promise.all([
        reservationService.getStatsReservations(hotelId),
        caisseService.getStatistiquesHotel(hotelId),
        factureService.getStatsFacturation(hotelId),
        avisService.getStatsAvis(hotelId),
        reservationService.getReservationsEnAttente(hotelId),
        caisseService.getDashboardCaisse(hotelId),
      ]);
      return res.status(200).json({
        success: true,
        data: {
          reservations: reservationStats,
          caisse: caisseStats,
          facturation: facturationStats,
          avis: avisStats,
          reservationsEnAttente: reservationsEnAttente.slice(0, 5),
          caisseInfo,
        },
      });
    } catch (error: unknown) {
      console.error("Erreur getDashboard:", error);
      const message =
        error instanceof Error ? error.message : "Erreur serveur";
      return res.status(500).json({ message });
    }
  }
};