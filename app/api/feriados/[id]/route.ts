import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { parse } from "cookie";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parse(cookieHeader || "");
    const token = cookies.myToken;

    // Verificar si existe el token
    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    // Verificar la validez del token
    const { ok } = verifyToken(token);
    if (!ok) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

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
    console.error("Error en DELETE /feriados:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "El feriado no existe" },
        { status: 404 }
      );
    }

    // Diferentes tipos de errores
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Error de base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
