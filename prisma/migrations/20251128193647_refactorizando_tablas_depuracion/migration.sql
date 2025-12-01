/*
  Warnings:

  - You are about to drop the column `fechaAdjudicacion` on the `Contratacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaApertura` on the `Contratacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaFirmaContratos` on the `Contratacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `Contratacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaPresentacion` on the `Contratacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaPresentacionDocs` on the `Contratacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Contratacion" DROP COLUMN "fechaAdjudicacion",
DROP COLUMN "fechaApertura",
DROP COLUMN "fechaFirmaContratos",
DROP COLUMN "fechaInicio",
DROP COLUMN "fechaPresentacion",
DROP COLUMN "fechaPresentacionDocs";
