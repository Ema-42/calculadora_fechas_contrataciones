import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie";
import { verifyToken } from "@/lib/jwt";

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

    const añoActual = new Date().getFullYear();
    const añoAnterior = añoActual - 1;

    // Obtener feriados del año anterior que no estén eliminados
    const feriadosAñoAnterior = await prisma.feriado.findMany({
      where: {
        fecha: {
          gte: new Date(`${añoAnterior}-01-01`),
          lte: new Date(`${añoAnterior}-12-31`),
        },
        eliminado: false,
      },
    });

    if (feriadosAñoAnterior.length === 0) {
      return NextResponse.json({
        message: `No hay feriados en ${añoAnterior} para restaurar`,
        insertados: 0,
        omitidos: 0,
      });
    }

    let insertados = 0;
    let omitidos = 0;

    // Procesar cada feriado del año anterior
    for (const feriado of feriadosAñoAnterior) {
      const fechaOriginal = new Date(feriado.fecha);

      // Cambiar el año a año actual manteniendo mes y día
      const nuevaFecha = new Date(
        añoActual,
        fechaOriginal.getMonth(),
        fechaOriginal.getDate()
      );

      try {
        // Intentar insertar el feriado con la nueva fecha
        await prisma.feriado.create({
          data: {
            nombre: feriado.nombre,
            fecha: nuevaFecha,
            eliminado: false,
          },
        });
        insertados++;
      } catch (error: any) {
        // Si hay error de duplicado (P2002), omitir este feriado
        if (error.code === "P2002") {
          omitidos++;
        } else {
          // Si es otro tipo de error, lanzarlo
          throw error;
        }
      }
    }

    return NextResponse.json({
      message: `Restauración completada`,
      insertados,
      omitidos,
      total: feriadosAñoAnterior.length,
    });
  } catch (error: any) {
    console.error(
      "Error en POST /feriados/restaurar:",
      error?.message || error
    );
    return NextResponse.json(
      { error: "Error al restaurar feriados" },
      { status: 500 }
    );
  }
}
