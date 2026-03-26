import prisma from "../prisma/client";
import { type Hotel } from "../interfaces/client.interface";

export const clientService = {
  // Récupérer les hôtels disponibles pour les clients
  async getAllHotels (): Promise<Hotel[]> {
        try {
        const hotels = await prisma.hotel.findMany({
            where: { estPublie: true, statut: "valider" },
            orderBy: { creeLe: "desc" },
            include: {
            images: true,
            _count: { select: { chambres: true } },
            },
        });
        return hotels as unknown as Hotel[];
        } catch (error) {
        console.error("Erreur lors de la récupération des hôtels :", error);
        throw new Error("Impossible de récupérer les hôtels");
        }
    },

    async getHotelById(id: number): Promise<Hotel | null> {
        try {
            const hotel = await prisma.hotel.findUnique({
                where: { idHotel: id },
                include: {
                    images: true,
                    equipements: {include: {equipement: true}},
                    services: {include: {service: true}},
                    chambres: { include: { images: true } },
                    visite3D: { include: { points: true } },
                },
            });
            return hotel as unknown as Hotel | null;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'hôtel :", error);
            throw new Error("Impossible de récupérer l'hôtel");
        }
    },

    // Récupérer les hôtels pour la page d'accueil (public)
    async getHotelsForHomepage(): Promise<Hotel[]> {
        try {
            const hotels = await prisma.hotel.findMany({
                where: { estPublie: true, statut: "valider" },
                take: 6,
                orderBy: { creeLe: "desc" },
                include: {
                    images: { take: 1 },
                    _count: { select: { chambres: true } },
                },
            });
            return hotels as unknown as Hotel[];
        } catch (error) {
            console.error("Erreur lors de la récupération des hôtels pour la page d'accueil :", error);
            throw new Error("Impossible de récupérer les hôtels");
        }
    },

    // Rechercher des hôtels par ville
    async searchHotelsByCity(city: string): Promise<Hotel[]> {
        try {
            const hotels = await prisma.hotel.findMany({
                where: { 
                    estPublie: true, 
                    statut: "valider",
                    ville: { contains: city, mode: "insensitive" }
                },
                orderBy: { creeLe: "desc" },
                include: {
                    images: true,
                    _count: { select: { chambres: true } },
                },
            });
            return hotels as unknown as Hotel[];
        } catch (error) {
            console.error("Erreur lors de la recherche des hôtels :", error);
            throw new Error("Impossible de rechercher les hôtels");
        }
    },
};