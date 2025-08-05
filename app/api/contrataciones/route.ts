import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registros = await prisma.contratacion.findMany({
      include: {
        modalidad: true, // 👈 esto es clave
      },
      orderBy: {
        fechaGeneracion: "desc",
      },
    });

    return NextResponse.json(registros);
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
    const body = await req.json();
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
    } = body;

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
    });

    return NextResponse.json(nueva);
  } catch (error: any) {
    console.error("Error al crear registro:", error);
    return NextResponse.json(
      { error: "Error al crear el registro" },
      { status: 500 }
    );
  }
}
