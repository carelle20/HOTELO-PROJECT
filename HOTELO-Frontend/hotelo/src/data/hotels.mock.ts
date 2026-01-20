export const hotels = [
  {
    id: 1,
    nom: "Hôtel Atlantique",
    adresse: "Douala, Akwa - Boulevard de la Liberté", // Remplacement de ville par adresse
    description: "Situé au cœur de Douala, l’Hôtel Atlantique vous offre confort, élégance et services haut de gamme avec une vue imprenable sur le Wouri.",
    note: 4.6,
    prixMin: 45000, // Mise à jour prix
    prixMax: 85000, // Mise à jour prix
    chambres: 25,
    latitude: 4.0511,
    longitude: 9.7679,
    images: [
      "/assets/hotels/hotel-1.jpg",
      "/assets/hotels/hotel-2.jpg",
      "/assets/hotels/hotel-3.jpg",
    ],
    amenities: ["wifi", "parking", "piscine", "climatisation", "restaurant", "securite"],
    rooms: [
      { id: 1, nom: "Chambre Standard", capacite: 2, prix: 45000 },
      { id: 2, nom: "Chambre Deluxe", capacite: 3, prix: 65000 },
    ],
    reviews: [
      { id: 1, auteur: "Jean M.", note: 5, commentaire: "Excellent séjour, personnel très accueillant.", date: "2024-11-12" },
      { id: 2, auteur: "Sarah K.", note: 4, commentaire: "Très bon hôtel, bon rapport qualité/prix.", date: "2024-10-28" },
    ],
    visite3D: [
      {
        id: "entree",
        nom: "Entrée de la chambre",
        image: "https://as2.ftcdn.net/jpg/01/83/48/17/1000_F_183481794_XVV7tm8VdFmlmdIcK0TI94hc9mDqDSnb.webp",
        points: [{ vers: "lit", position: [10, -5, -20], label: "Voir le lit" }]
      },
      {
        id: "lit",
        nom: "Espace Nuit",
        image: "https://as2.ftcdn.net/jpg/02/36/50/79/1000_F_236507964_3pC9ZeORCBoUNXNvXKQo7F0DmhdJBo85.webp",
        points: [
          { vers: "entree", position: [-10, -5, 20], label: "Retour entrée" },
          { vers: "douche", position: [20, -5, 5], label: "Aller à la douche" }
        ]
      },
      {
        id: "douche",
        nom: "Salle de Bain",
        image: "/assets/hotels/hotel-1.jpg",
        points: [{ vers: "lit", position: [-20, -5, 0], label: "Retour au lit" }]
      }
    ]
  },
  {
    id: 2,
    nom: "Résidence Bleu Azur",
    adresse: "Yaoundé, Bastos - Rue de l'ambassade",
    description: "Un havre de paix situé dans les quartiers résidentiels de Yaoundé, idéal pour les voyages d'affaires et la détente.",
    note: 4.3,
    prixMin: 38000,
    prixMax: 75000,
    chambres: 18,
    latitude: 3.8480,
    longitude: 11.5021,
    images: [
      "/assets/hotels/hotel-2.jpg",
      "/assets/hotels/hotel-1.jpg",
      "/assets/hotels/restaurant-hotel.jpg",
    ],
    amenities: ["wifi", "parking", "climatisation", "restaurant", "salle de sport"],
    rooms: [
      { id: 1, nom: "Studio Meublé", capacite: 2, prix: 38000 },
      { id: 2, nom: "Appartement T2", capacite: 4, prix: 75000 },
    ],
    reviews: [
      { id: 1, auteur: "Marc A.", note: 4, commentaire: "Calme et très propre. Je recommande.", date: "2024-12-05" },
    ],
    visite3D: "https://my.matterport.com/show/?m=example2",
  },
  {
    id: 3,
    nom: "Hôtel Prestige",
    adresse: "Bafoussam, Quartier Tamdja",
    description: "Découvrez l'hospitalité de l'Ouest dans un cadre moderne et chaleureux, avec une cuisine locale raffinée.",
    note: 4.1,
    prixMin: 30000,
    prixMax: 55000,
    chambres: 30,
    latitude: 5.4777,
    longitude: 10.4176,
    images: [
      "/assets/hotels/hotel-3.jpg",
      "/assets/hotels/hotel-2.jpg",
      "/assets/hotels/hotel-1.jpg",
    ],
    amenities: ["wifi", "parking", "restaurant", "bar", "salle de conférence"],
    rooms: [
      { id: 1, nom: "Chambre Simple", capacite: 1, prix: 30000 },
      { id: 2, nom: "Suite Junior", capacite: 2, prix: 50000 },
    ],
    reviews: [
      { id: 1, auteur: "Paul T.", note: 4, commentaire: "Le personnel est aux petits soins.", date: "2024-09-15" },
    ],
    visite3D: "https://my.matterport.com/show/?m=example3",
  },
  {
    id: 4,
    nom: "Complexe Royal Palace",
    adresse: "Kribi, Zone Plage - Boulevard de l'Océan",
    description: "Évadez-vous dans ce joyau situé en bordure de mer. Pieds dans l'eau, luxe et sérénité garantis.",
    note: 4.8,
    prixMin: 60000,
    prixMax: 150000,
    chambres: 40,
    latitude: 2.9391,
    longitude: 9.9107,
    images: [
      "/assets/hotels/hotel-4.jpg",
      "/assets/hotels/hotel-3.jpg",
      "/assets/hotels/hotel-2.jpg",
    ],
    amenities: ["wifi", "piscine", "climatisation", "restaurant", "plage privée", "spa"],
    rooms: [
      { id: 1, nom: "Vue sur Mer", capacite: 2, prix: 60000 },
      { id: 2, nom: "Suite Royale", capacite: 2, prix: 120000 },
    ],
    reviews: [
      { id: 1, auteur: "Marie L.", note: 5, commentaire: "La vue est tout simplement incroyable !", date: "2024-11-30" },
      { id: 2, auteur: "Christian B.", note: 5, commentaire: "Meilleur hôtel de Kribi.", date: "2024-12-20" },
    ],
    visite3D: "https://my.matterport.com/show/?m=example4",
  },
];