import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const year = new Date().getFullYear(); // Año actual, en 2025 será 2025

    const registros = await prisma.feriado.findMany({
      where: {
        fecha: {
          gte: new Date(`${year}-01-01`), // Mayor o igual al 1 de enero
          lte: new Date(`${year}-12-31`), // Menor o igual al 31 de diciembre
        },
        eliminado: false,
      },
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

export async function POST(req: Request) {
  try {
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
    console.error("Error exacto:", error?.message || error);
    return NextResponse.json(
      { error: "Error al crear el feriado" },
      { status: 500 }
    );
  }
} 