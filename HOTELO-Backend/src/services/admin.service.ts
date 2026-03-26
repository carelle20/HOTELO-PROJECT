import { HotelManager } from '../interfaces/admin.interface';
import prisma from '../prisma/client';

export const adminService = {
  // Récupérer les statistiques globales
  getStats: async () => {
    const [hotelsCount, managersCount, pendingCount] = await Promise.all([
      prisma.profilChefHotel.count(),
      prisma.utilisateur.count({ where: { role: 'chef_hotel' } }),
      prisma.utilisateur.count({ where: { role: 'chef_hotel', estValide: false } }),
    ]);

    return {
      hotelsCount,
      managersCount,
      pendingValidationCount: pendingCount,
      totalBookings: 0 
    };
  },

  // Récupérer tous les gérants avec leurs profils
    getAllManagers: async (): Promise<HotelManager[]> => {
        const managers = await prisma.utilisateur.findMany({
        where: { role: 'chef_hotel' },
        include: {
            profilChefHotel: {
            select: {
                nom_hotel: true,
                adresse_hotel: true,
                telephone: true
            }
            }
        }
        });
        return managers as unknown as HotelManager[];
    },

    // Valider ou refuser un responsable hotel
    ValidateManager: async (idUtilisateur: number, shouldValidate: boolean) => {
      console.log("Service reçoit ID:", idUtilisateur, "Type:", typeof idUtilisateur);
      return await prisma.utilisateur.update({
        where: { idUtilisateur: Number(idUtilisateur) },
        data: { 
            estValide: shouldValidate 
        },
        include: { profilChefHotel: true }
      });
    },

    // Creer un équipement
    async createEquipement(nom: string, icone?: string) {
      return prisma.equipement.create({
        data: { nom, icone }
      });
    },

    //  recuperer la liste des equipements
    async getAllEquipements() {
      return prisma.equipement.findMany({ orderBy: { nom: 'asc' } });
    },

  // Creer un service
    async createService(nom: string, icone?: string) {
      return prisma.service.create({
        data: { nom, icone }
      });
    },

    // Recuperer la liste des services
    async getAllServices() {
      return prisma.service.findMany({ orderBy: { nom: 'asc' } });
    },

    // Liste des hotels en attente
    async getAllHotels() {
      return prisma.hotel.findMany({
        include: {
          chefHotel: {
            select: {
              prenom: true,
              nom: true,
              email: true
            }
          },
          images: {
            select: {
              url: true,
              estPrincipale: true
            }
          }
        },
      });
    },

    async validateHotel(idHotel: number, statut: "valider" | "refuser") {
      const statutFinal = statut === "valider" ? "valider" : "refuser";
      return prisma.hotel.update({
        where: { idHotel: idHotel },
        data: { statut: statutFinal }
      });
    },
};