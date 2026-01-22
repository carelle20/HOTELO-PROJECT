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
    console.log('Super Admin prêt dans la base de données.');
  } catch (error) {
    console.error("Erreur pendant le upsert :", error);
  }
}

main().catch((e) => console.error(e)).finally(async () => {await prisma.$disconnect();});
