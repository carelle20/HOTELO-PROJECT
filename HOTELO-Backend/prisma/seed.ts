import prisma from "../src/prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from 'dotenv'; 
dotenv.config();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.utilisateur.upsert({
      where: { email: email },
      update: {
        motDePasse: hashedPassword,
        role: 'super_admin'
      },
      create: {
        prenom: 'Carelle',
        nom: 'TIOKANG',
        email: email,
        motDePasse: hashedPassword,
        role: 'super_admin',
        estValide: true,
        premiereConnexion: false, 
      },
    });


      // 🧑‍💼 Chef hôtel
    const chefHotel = await prisma.utilisateur.create({
      data: {
        prenom: "Jean",
        nom: "Mbarga",
        email: "chef@hotel.com",
        motDePasse: "hashed_password",
        role: "chef_hotel",
        estValide: true,
      },
    });

    await prisma.profilChefHotel.create({
      data: {
        nom_hotel: "Hôtel Atlantique",
        telephone: "+237690000000",
        adresse_hotel: "Douala",
        utilisateurId: chefHotel.idUtilisateur,
      },
    });
      // 🧰 Équipements
    const wifi = await prisma.equipement.create({ data: { nom: "WiFi", icone: "wifi" } });
    const piscine = await prisma.equipement.create({ data: { nom: "Piscine", icone: "pool" } });
    const parking = await prisma.equipement.create({ data: { nom: "Parking", icone: "parking" } });

    // 🏨 Hôtel
    const hotel = await prisma.hotel.create({
      data: {
        nom: "Hôtel Atlantique",
        description: "Un hôtel moderne au cœur de Douala",
        pays: "Cameroun",
        ville: "Douala",
        quartier: "Akwa",
        telephone: "+237690000000",
        nombreChambres: 25,
        prixMin: 45000,
        prixMax: 85000,
        numeroRegistre: "RC/DLA/2024/12345",
        statut: "valider",
        estPublie: true,
        chefHotelId: chefHotel.idUtilisateur,
      },
    });

    // Liaison équipements ↔ hôtel
    await prisma.hotelEquipement.createMany({
      data: [
        { hotelId: hotel.idHotel, equipementId: wifi.idEquipement },
        { hotelId: hotel.idHotel, equipementId: piscine.idEquipement },
        { hotelId: hotel.idHotel, equipementId: parking.idEquipement },
      ],
    });

    // 🛏️ Chambre
    const chambre = await prisma.chambre.create({
      data: {
        nom: "Chambre Deluxe",
        capacite: 3,
        prix: 65000,
        hotelId: hotel.idHotel,
      },
    });

    // 🖼️ Images hôtel
    await prisma.imageHotel.createMany({
      data: [
        { url: "/uploads/hotel1.jpg", estPrincipale: true, hotelId: hotel.idHotel },
        { url: "/uploads/hotel2.jpg", hotelId: hotel.idHotel },
      ],
    });

    // 🌐 Visite 3D
    const scene = await prisma.visite3DScene.create({
      data: {
        identifiant: "entree",
        nom: "Entrée",
        image360Url: "/uploads/360/entree.jpg",
        hotelId: hotel.idHotel,
      },
    });

    await prisma.visite3DPoint.create({
      data: {
        label: "Aller à la chambre",
        versScene: "chambre",
        positionX: 10,
        positionY: -5,
        positionZ: -20,
        sceneId: scene.idScene,
      },
    });

    console.log("✅ Seed terminé avec succès");

    console.log('Super Admin prêt dans la base de données.');
  } catch (error) {
    console.error("Erreur pendant le upsert :", error);
  }
}

main().catch((e) => console.error(e)).finally(async () => {await prisma.$disconnect();});
