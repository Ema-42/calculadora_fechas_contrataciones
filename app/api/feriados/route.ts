import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie";
import { verifyToken } from "@/lib/jwt";
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

    // Si el token es válido, proceder con la consulta
    const year = new Date().getFullYear();

    const registros = await prisma.feriado.findMany({
      where: {
        fecha: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
        eliminado: false,
      },
      orderBy: {
        fecha: "asc",
      },
    });

    return NextResponse.json(registros);
  } catch (error: any) {
    console.error("Error en GET /feriados:", error?.message || error);

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

export async function POST(req: Request) {
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

    const { nombre, fecha } = await req.json();

    // Validaciones básicas
    if (!nombre || !fecha) {
      return NextResponse.json(
        { error: "El nombre y la fecha son obligatorios" },
        { status: 400 }
      );
    }

    // Aseguramos que fecha sea un objeto Date válido
    const fechaFormateada = new Date(fecha);
    if (isNaN(fechaFormateada.getTime())) {
      return NextResponse.json(
        { error: "La fecha no es válida" },
        { status: 400 }
      );
    }

    // Crear registro
    const nuevoFeriado = await prisma.feriado.create({
      data: {
        nombre,
        fecha: fechaFormateada, // Prisma acepta Date para datetime
        eliminado: false, // por defecto en falso
      },
    });

    return NextResponse.json(nuevoFeriado, { status: 201 });
  } catch (error: any) {
    console.error("Error en POST /feriados:", error?.message || error);

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
