-- AlterTable
ALTER TABLE "public"."Contratacion" ADD COLUMN     "eliminado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "etapas" JSONB,
ADD COLUMN     "usuarioCreacion" TEXT;

-- AlterTable
ALTER TABLE "public"."Feriado" ADD COLUMN     "usuarioModificacion" TEXT;

-- AlterTable
ALTER TABLE "public"."Modalidad" ADD COLUMN     "usuarioModificacion" TEXT;

-- CreateTable
CREATE TABLE "public"."Etapas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "usuarioModificacion" TEXT,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModalidadEtapa" (
    "id" SERIAL NOT NULL,
    "etapaId" INTEGER NOT NULL,
    "cantidad" TEXT DEFAULT '0',
    "eliminado" BOOLEAN NOT NULL DEFAULT false,
    "usuarioModificacion" TEXT,
    "modalidadId" INTEGER NOT NULL,

    CONSTRAINT "ModalidadEtapa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ModalidadEtapa" ADD CONSTRAINT "ModalidadEtapa_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "public"."Modalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModalidadEtapa" ADD CONSTRAINT "ModalidadEtapa_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "public"."Etapas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
