import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;

  const existe = await prisma.utilisateur.findUnique({
    where: { email }
  });

  if (!existe) {
    await prisma.utilisateur.create({
      data: {
        prenom: "Super",
        nom: "Admin",
        email,
        motDePasse: await bcrypt.hash(password, 10),
        role: "super_admin",
        estValide: true
      }
    });
    console.log("Super administrateur créé avec succès.");
  }
}

main();
