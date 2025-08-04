-- CreateTable
CREATE TABLE "Modalidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contratacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "fechaGeneracion" DATETIME NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaPublicacion" DATETIME NOT NULL,
    "fechaApertura" DATETIME NOT NULL,
    "fechaAdjudicacion" DATETIME NOT NULL,
    "fechaPresentacionDocs" DATETIME NOT NULL,
    "fechaFirmaContratos" DATETIME NOT NULL,
    "modalidadId" INTEGER NOT NULL,
    CONSTRAINT "Contratacion_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "Modalidad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feriado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "motivo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Modalidad_nombre_key" ON "Modalidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Feriado_fecha_key" ON "Feriado"("fecha");
