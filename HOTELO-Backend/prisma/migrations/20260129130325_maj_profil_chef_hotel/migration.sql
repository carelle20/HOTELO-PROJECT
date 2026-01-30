/*
  Warnings:

  - You are about to drop the column `email_hotel` on the `ProfilChefHotel` table. All the data in the column will be lost.
  - You are about to drop the column `numero_registre` on the `ProfilChefHotel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfilChefHotel" DROP COLUMN "email_hotel",
DROP COLUMN "numero_registre";
