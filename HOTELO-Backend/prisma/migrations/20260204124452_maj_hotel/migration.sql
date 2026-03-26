/*
  Warnings:

  - You are about to drop the column `motifRefus` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `quartier` on the `Hotel` table. All the data in the column will be lost.
  - Added the required column `adresse` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Hotel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `Hotel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Hotel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "motifRefus",
DROP COLUMN "quartier",
ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "estPublie" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- CreateTable
CREATE TABLE "Service" (
    "idService" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "icone" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("idService")
);

-- CreateTable
CREATE TABLE "HotelService" (
    "hotelId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "HotelService_pkey" PRIMARY KEY ("hotelId","serviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_nom_key" ON "Service"("nom");

-- AddForeignKey
ALTER TABLE "HotelService" ADD CONSTRAINT "HotelService_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelService" ADD CONSTRAINT "HotelService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("idService") ON DELETE RESTRICT ON UPDATE CASCADE;
