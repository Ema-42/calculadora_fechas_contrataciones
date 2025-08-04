import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const registros = await prisma.contratacion.findMany({
      include: {
        modalidad: true,
      },
      orderBy: {
        fechaGeneracion: "desc",
      },
    });

    const registrosTransformados = registros.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      monto: r.monto,
      fechaGeneracion: r.fechaGeneracion,
      fechaInicio: r.fechaInicio,
      fechaPublicacion: r.fechaPublicacion,
      fechaApertura: r.fechaApertura,
      fechaAdjudicacion: r.fechaAdjudicacion,
      fechaPresentacionDocs: r.fechaPresentacionDocs,
      fechaFirmaContratos: r.fechaFirmaContratos,
      modalidadId: r.modalidadId,
      modalidad: r.modalidad?.nombre || "N/A", // 🔥 nombre en lugar de objeto
    }));

    return NextResponse.json(registrosTransformados);
  } catch (error: any) {
    console.error("Error exacto:", error?.message || error);
    return NextResponse.json(
      { error: "Error al obtener datos" },
      { status: 500 }
    );
  }
}

 
 

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      titulo,
      fechaInicio,
      fechaGeneracion,
      modalidadId,
      monto,
      fechaPublicacion,
      fechaApertura,
      fechaAdjudicacion,
      fechaPresentacionDocs,
      fechaFirmaContratos,
    } = body

    const nueva = await prisma.contratacion.create({
      data: {
        titulo,
        fechaInicio,
        fechaGeneracion,
        modalidadId,
        monto,
        fechaPublicacion,
        fechaApertura,
        fechaAdjudicacion,
        fechaPresentacionDocs,
        fechaFirmaContratos,
      },
      include: {
        modalidad: true,
      },
    })

    return NextResponse.json(nueva)
  } catch (error: any) {
    console.error("Error al crear registro:", error)
    return NextResponse.json(
      { error: "Error al crear el registro" },
      { status: 500 }
    )
  }
}

