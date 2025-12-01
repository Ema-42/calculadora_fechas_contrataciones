/*
  Warnings:

  - Made the column `fechaInicio` on table `Contratacion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Contratacion" ALTER COLUMN "fechaInicio" SET NOT NULL;
