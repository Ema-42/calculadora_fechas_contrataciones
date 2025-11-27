import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parse(cookieHeader || "");
    const token = cookies.myToken;

    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const { ok } = verifyToken(token);
    if (!ok) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const registros = await (prisma as any).etapas.findMany({
      where: { eliminado: false },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(registros);
  } catch (error: any) {
    console.error("Error en GET /etapas:", error?.message || error);

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

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parse(cookieHeader || "");
    const token = cookies.myToken;

    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const { ok } = verifyToken(token);
    if (!ok) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();
    const { nombre, usuarioModificacion } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const nuevoRegistro = await (prisma as any).etapas.create({
      data: {
        nombre,
        usuarioModificacion: usuarioModificacion || null,
        eliminado: false,
      },
    });

    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error: any) {
    console.error("Error en POST /etapas:", error?.message || error);

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
