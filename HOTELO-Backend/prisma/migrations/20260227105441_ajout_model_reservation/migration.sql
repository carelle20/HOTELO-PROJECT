-- CreateEnum
CREATE TYPE "StatutReservation" AS ENUM ('en_attente', 'confirmée', 'annulée', 'complétée');

-- CreateEnum
CREATE TYPE "StatutFacture" AS ENUM ('générée', 'payée', 'annulée');

-- CreateEnum
CREATE TYPE "TypeCaisse" AS ENUM ('revenus', 'dépenses', 'ajustement');

-- CreateTable
CREATE TABLE "Reservation" (
    "idReservation" SERIAL NOT NULL,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "dateDepart" TIMESTAMP(3) NOT NULL,
    "nombreNuits" INTEGER NOT NULL,
    "nombrePersonnes" INTEGER NOT NULL,
    "statut" "StatutReservation" NOT NULL DEFAULT 'en_attente',
    "motifAnnulation" TEXT,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "montantTotal" DOUBLE PRECISION NOT NULL,
    "clientId" INTEGER NOT NULL,
    "chambreId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("idReservation")
);

-- CreateTable
CREATE TABLE "Facture" (
    "idFacture" SERIAL NOT NULL,
    "numeroFacture" TEXT NOT NULL,
    "montantHT" DOUBLE PRECISION NOT NULL,
    "montantTVA" DOUBLE PRECISION NOT NULL,
    "montantTTC" DOUBLE PRECISION NOT NULL,
    "statut" "StatutFacture" NOT NULL DEFAULT 'générée',
    "datePaiement" TIMESTAMP(3),
    "reservationId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "urlPDF" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("idFacture")
);

-- CreateTable
CREATE TABLE "Caisse" (
    "idCaisse" SERIAL NOT NULL,
    "type" "TypeCaisse" NOT NULL,
    "description" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'validée',
    "utilisateurId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "reservationId" INTEGER,
    "factureId" INTEGER,
    "justificatifUrl" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,
    "creePar" INTEGER NOT NULL,

    CONSTRAINT "Caisse_pkey" PRIMARY KEY ("idCaisse")
);

-- CreateTable
CREATE TABLE "Avis" (
    "idAvis" SERIAL NOT NULL,
    "titre" TEXT,
    "commentaire" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "reservationId" INTEGER,
    "estModere" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("idAvis")
);

-- CreateTable
CREATE TABLE "DisponibiliteChambre" (
    "idDisponibilite" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "raison" TEXT,
    "chambreId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "reservationId" INTEGER,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisponibiliteChambre_pkey" PRIMARY KEY ("idDisponibilite")
);

-- CreateIndex
CREATE INDEX "Reservation_clientId_idx" ON "Reservation"("clientId");

-- CreateIndex
CREATE INDEX "Reservation_chambreId_idx" ON "Reservation"("chambreId");

-- CreateIndex
CREATE INDEX "Reservation_hotelId_idx" ON "Reservation"("hotelId");

-- CreateIndex
CREATE INDEX "Reservation_dateArrivee_idx" ON "Reservation"("dateArrivee");

-- CreateIndex
CREATE INDEX "Reservation_statut_idx" ON "Reservation"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numeroFacture_key" ON "Facture"("numeroFacture");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_reservationId_key" ON "Facture"("reservationId");

-- CreateIndex
CREATE INDEX "Facture_numeroFacture_idx" ON "Facture"("numeroFacture");

-- CreateIndex
CREATE INDEX "Facture_reservationId_idx" ON "Facture"("reservationId");

-- CreateIndex
CREATE INDEX "Facture_hotelId_idx" ON "Facture"("hotelId");

-- CreateIndex
CREATE INDEX "Facture_clientId_idx" ON "Facture"("clientId");

-- CreateIndex
CREATE INDEX "Facture_statut_idx" ON "Facture"("statut");

-- CreateIndex
CREATE INDEX "Caisse_hotelId_idx" ON "Caisse"("hotelId");

-- CreateIndex
CREATE INDEX "Caisse_type_idx" ON "Caisse"("type");

-- CreateIndex
CREATE INDEX "Caisse_statut_idx" ON "Caisse"("statut");

-- CreateIndex
CREATE INDEX "Caisse_creeLe_idx" ON "Caisse"("creeLe");

-- CreateIndex
CREATE INDEX "Avis_hotelId_idx" ON "Avis"("hotelId");

-- CreateIndex
CREATE INDEX "Avis_clientId_idx" ON "Avis"("clientId");

-- CreateIndex
CREATE INDEX "Avis_note_idx" ON "Avis"("note");

-- CreateIndex
CREATE INDEX "Avis_estModere_idx" ON "Avis"("estModere");

-- CreateIndex
CREATE INDEX "DisponibiliteChambre_hotelId_idx" ON "DisponibiliteChambre"("hotelId");

-- CreateIndex
CREATE INDEX "DisponibiliteChambre_date_idx" ON "DisponibiliteChambre"("date");

-- CreateIndex
CREATE INDEX "DisponibiliteChambre_disponible_idx" ON "DisponibiliteChambre"("disponible");

-- CreateIndex
CREATE UNIQUE INDEX "DisponibiliteChambre_chambreId_date_key" ON "DisponibiliteChambre"("chambreId", "date");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("idChambre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("idReservation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caisse" ADD CONSTRAINT "Caisse_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caisse" ADD CONSTRAINT "Caisse_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caisse" ADD CONSTRAINT "Caisse_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("idReservation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caisse" ADD CONSTRAINT "Caisse_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("idFacture") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("idReservation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisponibiliteChambre" ADD CONSTRAINT "DisponibiliteChambre_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("idChambre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisponibiliteChambre" ADD CONSTRAINT "DisponibiliteChambre_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("idHotel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisponibiliteChambre" ADD CONSTRAINT "DisponibiliteChambre_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("idReservation") ON DELETE SET NULL ON UPDATE CASCADE;
