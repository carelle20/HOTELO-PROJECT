// backend/src/services/manager.service.ts
import prisma from "../prisma/client";
import { CreateHotel, CreateChambre, ImageHotel } from "../interfaces/manager.interface";
import { Hotel } from "@prisma/client";

export const ManagerService = {
  /* Calcule toutes les statistiques pour le dashboard d'un manager */
  async getDashboardStats(chefHotelId: number) {
      // 1. Récupération des données brutes
      const hotels = await prisma.hotel.findMany({
      where: { chefHotelId: chefHotelId },
      include: {
          chambres: true,
          images: true,
          visite3D: true,
      },
      });

      // 2. Calcul des indicateurs de statut
      const hotelsPublished = hotels.filter(h => h.statut === "valider").length;
      const hotelsPending = hotels.filter(h => h.statut === "en_attente").length;

      // 3. Vérification des éléments manquants (Logique d'alerte)
      const hasRooms = hotels.length > 0 && hotels.every(h => h.chambres.length > 0);
      const hasImages = hotels.length > 0 && hotels.every(h => h.images.length > 0);
      const has3D = hotels.length > 0 && hotels.some(h => h.visite3D.length > 0);

      // 4. Calcul du score qualité (sur 100)
      let qualityScore = 0;
      if (hotels.length > 0) {
      if (hasImages) qualityScore += 30;
      if (hasRooms) qualityScore += 30;
      if (has3D) qualityScore += 40;
      }

      // 5. Retourne l'objet formaté selon ton interface Frontend
      return {
      activeBookings: 0, // Sera lié au futur modèle Reservation
      monthlyRevenue: 0,
      availableRooms: hotels.reduce((acc, h) => acc + h.chambres.length, 0),
      occupancyRate: 0,
      hotelsPublished,
      hotelsPending,
      profileCompletion: 80, // Exemple statique ou calculé sur l'utilisateur
      qualityScore,
      missingImages: !hasImages && hotels.length > 0,
      missingRooms: !hasRooms && hotels.length > 0,
      missing3DVisit: !has3D && hotels.length > 0,
      };
  },
  
  /* Création d'un hôtel */
  async createHotel(data: CreateHotel, chefHotelId: number, images: ImageHotel[]): Promise<Hotel> {
      return await prisma.$transaction(async (tx) => {
        const hotel = await tx.hotel.create({
          data: {
            nom: data.nom,
            description: data.description,
            pays: data.pays,
            ville: data.ville,
            adresse: data.adresse,
            latitude: Number(data.latitude), // Sécurité : conversion en nombre
            longitude: Number(data.longitude),
            telephone: data.telephone,
            email: data.email || null,
            nombreChambres: Number(data.nombreChambres),
            prixMin: Number(data.prixMin),
            prixMax: Number(data.prixMax),
            numeroRegistre: data.numeroRegistre,
            chefHotelId: chefHotelId,
            statut: 'valider',
            estPublie: true,
              // image principale
            images: {
              create: images.map((img: ImageHotel) => ({
                url: img.url,
                estPrincipale: img.estPrincipale
              }))
            },    

            // Insertion typée de la visite 3D (Scènes + Points)
            visite3D: {
              create: images.map((img, index) => ({
                identifiant: `scene_${index}`,
                nom: img.estPrincipale ? "Vue Principale" : `Vue ${index + 1}`,
                image360Url: img.url,
                // Note: Les points (hotspots) restent vides pour une configuration manuelle future
              })),
            },
            equipements: {
                create: data.equipementsIds.map((id) => ({
                    equipement: { connect: { idEquipement: id } }
                }))
            },
            services: {
                create: data.servicesIds.map((id) => ({
                    service: { connect: { idService: id } }
                }))
            }
          },
          include: {
              images: true
          }
        });
        return hotel;
      });
  },

  /* Liste des hôtels du chef connecté */
  async getMyHotels(chefHotelId: number) {
      return prisma.hotel.findMany({
      where: { chefHotelId },
      orderBy: { creeLe: "desc" },
      include: {
          images: true,
          // chambres: { select: { prix: true } },
          _count: { select: { chambres: true } }
      },
      });
  },

  async getHotelById(idHotel: number) {
    return prisma.hotel.findUnique({
        where: { idHotel: idHotel },
        include: {
            images: true,
            equipements: {include: {equipement: true}},
            services: {include: {service: true}},
            chambres: { include: { images: true } },
            visite3D: { include: { points: true } },
        }
    });
  },

  //modifier un hotel
  async updateHotel(idHotel: number, chefHotelId: number, data: Partial<CreateHotel>) {
    const hotel = await prisma.hotel.findFirst({ where: { idHotel, chefHotelId } });
    if (!hotel) throw new Error("Accès non autorisé ou hôtel inexistant");
    return await prisma.hotel.update({
      where: { idHotel: idHotel },
      data: {
        nom: data.nom,
        description: data.description,
        adresse: data.adresse,
        ville: data.ville,
        prixMin: data.prixMin,
        nombreChambres: data.nombreChambres,
        latitude: data.latitude,
        longitude: data.longitude,
        // On vérifie si visite3D est présent dans les données reçues
        visite3D: data.visite3D ? {
          // On vide et on recrée tout
          deleteMany: {}, 
          create: data.visite3D.map(scene => ({
            identifiant: scene.identifiant,
            nom: scene.nom,
            image360Url: scene.imageUrl, 
            points: {
              create: scene.points?.map(p => ({
                label: p.label,
                versScene: p.versScene,
                positionX: p.positionX,
                positionY: p.positionY,
                positionZ: p.positionZ
              }))
            }
          }))
        } : undefined
      }
    });
  },

  /* Soumettre un hôtel à validation */
  async submitHotel(idHotel: number, chefHotelId: number) {
    return prisma.hotel.update({
      where: {
        idHotel,
        chefHotelId,
      },
      data: {
        statut: "en_attente",
      },
    });
  }, 

  /* Creer une chambre */
  async createChambre(idHotel: number, data: CreateChambre, files: string[]) {
    return await prisma.$transaction(async (tx) => {
      const chambre = await tx.chambre.create({
        data: {
          nom: data.nom,
          description: data.description,
          capacite: Number(data.capacite),
          prix: Number(data.prix),
          hotelId: idHotel,
        },
      });
      // ajout des images
      if (files.length > 0) {
        await tx.imageChambre.createMany({
          data: files.map((url, index) => ({
            url: url,
            chambreId: chambre.idChambre,
          })),
        });
      }
      return tx.chambre.findUnique({
        where: { idChambre: chambre.idChambre },
        include: { images: true }
      });
    });
  },

  /* Supprimer une chambre */
  async deleteChambre(idChambre: number, chefHotelId: number) {
    const chambre = await prisma.chambre.findFirst({
      where: { idChambre, hotel: { chefHotelId } }
    });
    if (!chambre) throw new Error("Suppression impossible : chambre non trouvée ou non autorisée");
    return prisma.chambre.delete({ where: { idChambre } });
  },

  async getChambres(hotelId: number, chefHotelId: number) {
    // On vérifie que l'hôtel appartient bien au chef pour la sécurité
    return await prisma.chambre.findMany({
      where: { 
        hotelId: hotelId,
        hotel: { chefHotelId: chefHotelId } 
      },
      include: { images: true }
    });
  },

  async addHotelImages(idHotel: number, files: Express.Multer.File[]) {
    const existingImagesCount = await prisma.imageHotel.count({
      where: { hotelId: idHotel }
    });
    const operations = files.map((file, index) => {
      return prisma.imageHotel.create({
        data: {
          url: `/uploads/hotels/${file.filename}`,
          estPrincipale: existingImagesCount === 0 && index === 0,
          hotelId: idHotel
        }
      });
    });
    return Promise.all(operations);
  },

  /* Récupérer tous les équipements et services disponibles */
  async getCatalogues() {
    const [equipements, services] = await Promise.all([
      prisma.equipement.findMany(),
      prisma.service.findMany(),
    ]);
    return { equipements, services };
  },

  /* Assigner des équipements et services à un hôtel
  * On utilise une transaction pour s'assurer que tout est bien lié */
  async updateHotelCatalog(idHotel: number, chefHotelId: number, equipementIds: number[], serviceIds: number[]) {
    const hotel = await prisma.hotel.findFirst({ where: { idHotel, chefHotelId } });
    if (!hotel) throw new Error("Hôtel non trouvé");

    return prisma.$transaction([
      // Nettoyage des anciennes sélections
      prisma.hotelEquipement.deleteMany({ where: { hotelId: idHotel } }),
      prisma.hotelService.deleteMany({ where: { hotelId: idHotel } }),
      // Ajout des nouvelles sélections
      prisma.hotelEquipement.createMany({
        data: equipementIds.map(id => ({ hotelId: idHotel, equipementId: id }))
      }),
      prisma.hotelService.createMany({
        data: serviceIds.map(id => ({ hotelId: idHotel, serviceId: id }))
      })
    ]);
  },

  /* Reservations des hotels d'un chef */
  async getManagerReservations(chefHotelId: number) {
    return prisma.reservation.findMany({
      where: {
        chambre: {
          hotel: {
            chefHotelId
          }
        }
      },
      include: {
        client: {
          select: {
            idUtilisateur: true,
            nom: true,
            email: true
          }
        },
        chambre: {
          select: {
            idChambre: true,
            nom: true,
            hotel: {
              select: {
                idHotel: true,
                nom: true,
                ville: true
              }
            }
          }
        }
      },
      orderBy: {
        creeLe: "desc"
      }
    });
  },

  /* Réservations récentes d'un hotel */
  async getRecentReservations(chefHotelId: number) {
    return prisma.reservation.findMany({
      where: {
        chambre: {
          hotel: {
            chefHotelId
          }
        }
      },
      include: {
        client: true,
        chambre: {
          include: {
            hotel: true
          }
        }
      },
      take: 5,
      orderBy: {
        creeLe: "desc"
      }
    });
  },

  /* Confirmer réservation */
  async confirmReservation(reservationId: number) {
    return prisma.reservation.update({
      where: { idReservation: reservationId },
      data: {
        statut: "confirmée"
      }
    });
  },

  /* Annuler réservation */
  async cancelReservation(reservationId: number) {
    return prisma.reservation.update({
      where: { idReservation: reservationId },
      data: {
        statut: "annulée"
      }
    });
  }
};