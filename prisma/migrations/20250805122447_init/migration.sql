-- CreateTable
CREATE TABLE "public"."Modalidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "publicacion" TEXT NOT NULL,
    "apertura" TEXT NOT NULL,
    "adjudicacion" TEXT NOT NULL,
    "presentacion" TEXT NOT NULL,
    "firma" TEXT NOT NULL,

    CONSTRAINT "Modalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contratacion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL,
    "fechaApertura" TIMESTAMP(3) NOT NULL,
    "fechaAdjudicacion" TIMESTAMP(3) NOT NULL,
    "fechaPresentacionDocs" TIMESTAMP(3) NOT NULL,
    "fechaFirmaContratos" TIMESTAMP(3) NOT NULL,
    "modalidadId" INTEGER NOT NULL,

    CONSTRAINT "Contratacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feriado" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Feriado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feriado_fecha_key" ON "public"."Feriado"("fecha");

-- AddForeignKey
ALTER TABLE "public"."Contratacion" ADD CONSTRAINT "Contratacion_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "public"."Modalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
