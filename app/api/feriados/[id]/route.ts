import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "El ID debe ser un número válido" },
        { status: 400 }
      );
    }

    const feriadoActualizado = await prisma.feriado.update({
      where: { id },
      data: {
        eliminado: true,
      },
    });

    return NextResponse.json(
      {
        message: "Feriado eliminado correctamente",
        feriado: feriadoActualizado,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error exacto:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "El feriado no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar el feriado" },
      { status: 500 }
    );
  }
}
