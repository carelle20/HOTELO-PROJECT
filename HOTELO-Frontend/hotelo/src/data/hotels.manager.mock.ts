export interface Hotel {
  id: number;
  name: string;
  city: string;
  description: string;
  amenities: string[];
  images: string[];
  ownerId: number;
}

export const hotel: Hotel[] = [];

export type HotelStatus = "EN_ATTENTE" | "VALIDE" | "REFUSE";

export interface ManagerHotel extends Hotel {
  status: HotelStatus;
  roomsCount: number;
  minPrice: number;
}

export const managerHotels: ManagerHotel[] = [
  {
    id: 1,
    name: "Hôtel Atlantique",
    city: "Douala",
    description: "Hôtel moderne au cœur de la ville",
    amenities: ["wifi", "parking", "restaurant"],
    images: [],
    ownerId: 1,
    status: "EN_ATTENTE",
    roomsCount: 25,
    minPrice: 45000,
  },
  {
    id: 2,
    name: "Résidence Bleu Azur",
    city: "Yaoundé",
    description: "Résidence calme pour séjours professionnels",
    amenities: ["wifi", "climatisation"],
    images: [],
    ownerId: 1,
    status: "VALIDE",
    roomsCount: 18,
    minPrice: 38000,
  },
];


