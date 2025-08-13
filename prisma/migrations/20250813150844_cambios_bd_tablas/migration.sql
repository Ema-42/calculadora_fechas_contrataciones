/*
  Warnings:

  - You are about to drop the column `fechaPublicacion` on the `Contratacion` table. All the data in the column will be lost.
  - You are about to drop the column `publicacion` on the `Modalidad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Contratacion" DROP COLUMN "fechaPublicacion",
ADD COLUMN     "fechaPresentacion" TIMESTAMP(3),
ALTER COLUMN "titulo" DROP NOT NULL,
ALTER COLUMN "monto" DROP NOT NULL,
ALTER COLUMN "fechaGeneracion" DROP NOT NULL,
ALTER COLUMN "fechaInicio" DROP NOT NULL,
ALTER COLUMN "fechaApertura" DROP NOT NULL,
ALTER COLUMN "fechaAdjudicacion" DROP NOT NULL,
ALTER COLUMN "fechaPresentacionDocs" DROP NOT NULL,
ALTER COLUMN "fechaFirmaContratos" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Modalidad" DROP COLUMN "publicacion",
ADD COLUMN     "presentacion_docs" TEXT,
ALTER COLUMN "nombre" DROP NOT NULL,
ALTER COLUMN "apertura" DROP NOT NULL,
ALTER COLUMN "adjudicacion" DROP NOT NULL,
ALTER COLUMN "presentacion" DROP NOT NULL,
ALTER COLUMN "firma" DROP NOT NULL;
