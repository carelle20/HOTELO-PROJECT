-- CreateEnum
CREATE TYPE "StatutHotel" AS ENUM ('brouillon', 'en_attente', 'valider', 'refuser');

-- CreateTable
CREATE TABLE "Hotel" (
    "idHotel" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "pays" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "quartier" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "nombreChambres" INTEGER NOT NULL,
    "prixMin" DOUBLE PRECISION NOT NULL,
    "prixMax" DOUBLE PRECISION NOT NULL,
    "numeroRegistre" TEXT NOT NULL,
    "statut" "StatutHotel" NOT NULL DEFAULT 'brouillon',
    "motifRefus" TEXT,
    "chefHotelId" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("idHotel")
);

-- CreateTable
CREATE TABLE "Chambre" (
    "idChambre" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "capacite" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chambre_pkey" PRIMARY KEY ("idChambre")
);

-- CreateTable
CREATE TABLE "Equipement" (
    "idEquipement" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "icone" TEXT,

    CONSTRAINT "Equipement_pkey" PRIMARY KEY ("idEquipement")
);

-- CreateTable
CREATE TABLE "HotelEquipement" (
    "hotelId" INTEGER NOT NULL,
    "equipementId" INTEGER NOT NULL,

    CONSTRAINT "HotelEquipement_pkey" PRIMARY KEY ("hotelId","equipementId")
);

-- CreateTable
CREATE TABLE "ImageHotel" (
    "idImageHotel" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "estPrincipale" BOOLEAN NOT NULL DEFAULT false,
    "hotelId" INTEGER NOT NULL,

    CONSTRAINT "ImageHotel_pkey" PRIMARY KEY ("idImageHotel")
);

-- CreateTable
CREATE TABLE "ImageChambre" (
    "idImageChambre" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "chambreId" INTEGER NOT NULL,

    CONSTRAINT "ImageChambre_pkey" PRIMARY KEY ("idImageChambre")
);

-- CreateTable
CREATE TABLE "DocumentHotel" (
    "idDocument" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentHotel_pkey" PRIMARY KEY ("idDocument")
);

-- CreateTable
CREATE TABLE "Visite3DScene" (
    "idScene" SERIAL NOT NULL,
    "identifiant" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "image360Url" TEXT NOT NULL,
    "hotelId" INTEGER,
    "chambreId" INTEGER,

    CONSTRAINT "Visite3DScene_pkey" PRIMARY KEY ("idScene")
);

-- CreateTable
CREATE TABLE "Visite3DPoint" (
    "idPoint" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "versScene" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "positionZ" DOUBLE PRECISION NOT NULL,
    "sceneId" INTEGER NOT NULL,

    CONSTRAINT "Visite3DPoint_pkey" PRIMARY KEY ("idPoint")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipement_nom_key" ON "Equipement"("nom");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_chefHotelId_fkey" FOREIGN KEY ("chefHotelId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chambre" ADD CONSTRAINT "Chambre_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelEquipement" ADD CONSTRAINT "HotelEquipement_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelEquipement" ADD CONSTRAINT "HotelEquipement_equipementId_fkey" FOREIGN KEY ("equipementId") REFERENCES "Equipement"("idEquipement") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageHotel" ADD CONSTRAINT "ImageHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageChambre" ADD CONSTRAINT "ImageChambre_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("idChambre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHotel" ADD CONSTRAINT "DocumentHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite3DScene" ADD CONSTRAINT "Visite3DScene_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite3DScene" ADD CONSTRAINT "Visite3DScene_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("idChambre") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite3DPoint" ADD CONSTRAINT "Visite3DPoint_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Visite3DScene"("idScene") ON DELETE RESTRICT ON UPDATE CASCADE;
