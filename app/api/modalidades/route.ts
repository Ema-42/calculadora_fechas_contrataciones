import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { parse } from "cookie";

export async function GET(req: Request) {
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

    const registros = await prisma.modalidad.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(registros);
  } catch (error: any) {
    console.error("Error en GET /modalidad:", error?.message || error);

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
