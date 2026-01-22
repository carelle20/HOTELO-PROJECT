/*
  Warnings:

  - The primary key for the `ProfilChefHotel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProfilChefHotel` table. All the data in the column will be lost.
  - The primary key for the `Utilisateur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfilChefHotel" DROP CONSTRAINT "ProfilChefHotel_utilisateurId_fkey";

-- AlterTable
ALTER TABLE "ProfilChefHotel" DROP CONSTRAINT "ProfilChefHotel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_profilChefHotel" SERIAL NOT NULL,
ADD CONSTRAINT "ProfilChefHotel_pkey" PRIMARY KEY ("id_profilChefHotel");

-- AlterTable
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_pkey",
DROP COLUMN "id",
ADD COLUMN     "idUtilisateur" SERIAL NOT NULL,
ADD COLUMN     "premiereConnexion" BOOLEAN NOT NULL DEFAULT true,
ADD CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("idUtilisateur");

-- AddForeignKey
ALTER TABLE "ProfilChefHotel" ADD CONSTRAINT "ProfilChefHotel_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;
