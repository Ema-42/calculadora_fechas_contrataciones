import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registros = await prisma.feriado.findMany({
      orderBy: {
        nombre: "asc",
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
