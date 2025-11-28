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

    const registros = await (prisma as any).modalidadEtapa.findMany({
      where: {
        eliminado: false,
        modalidad: {
          eliminado: false,
        },
        etapa: {
          eliminado: false,
        },
      },
      include: {
        modalidad: true,
        etapa: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(registros);
  } catch (error: any) {
    console.error("Error en GET /modalidades-etapas:", error?.message || error);

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
    const { etapaId, modalidadId, cantidad, habilitado, usuarioModificacion } =
      body;

    if (!etapaId || !modalidadId) {
      return NextResponse.json(
        { error: "etapaId y modalidadId son obligatorios" },
        { status: 400 }
      );
    }

    const nuevoRegistro = await (prisma as any).modalidadEtapa.create({
      data: {
        etapaId,
        modalidadId,
        cantidad: cantidad || "0",
        habilitado: habilitado !== undefined ? habilitado : true,
        usuarioModificacion: usuarioModificacion || null,
        eliminado: false,
      },
      include: {
        modalidad: true,
        etapa: true,
      },
    });

    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error: any) {
    console.error(
      "Error en POST /modalidades-etapas:",
      error?.message || error
    );

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
