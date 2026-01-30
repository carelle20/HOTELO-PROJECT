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
        // On retourne aussi le profil pour confirmer au frontend
        include: { profilChefHotel: true }
        });
    }
};