-- CreateEnum
CREATE TYPE "Role" AS ENUM ('client', 'chef_hotel', 'admin', 'super_admin');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'client',
    "estValide" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilChefHotel" (
    "id" SERIAL NOT NULL,
    "nom_hotel" TEXT NOT NULL,
    "adresse_hotel" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "numero_registre" TEXT NOT NULL,
    "email_hotel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "ProfilChefHotel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilChefHotel_utilisateurId_key" ON "ProfilChefHotel"("utilisateurId");

-- AddForeignKey
ALTER TABLE "ProfilChefHotel" ADD CONSTRAINT "ProfilChefHotel_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
