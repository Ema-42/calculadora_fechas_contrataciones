import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Obtener parámetros con valores por defecto
    const limit = parseInt(searchParams.get("limit") || "5");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    // Validar parámetros
    if (limit < 1 || page < 1) {
      return NextResponse.json(
        { error: "Los parámetros limit y page deben ser números positivos" },
        { status: 400 }
      );
    }

    // Calcular offset para la paginación
    const offset = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const whereClause = search.trim()
      ? {
          OR: [
            {
              titulo: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              modalidad: {
                nombre: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
            },
            {
              id: isNaN(parseInt(search.trim()))
                ? undefined
                : parseInt(search.trim()),
            },
          ].filter(
            (condition) =>
              condition.id !== undefined ||
              condition.titulo ||
              condition.modalidad
          ),
        }
      : {};

    // Obtener total de registros para calcular páginas (con filtro de búsqueda)
    const totalRegistros = await prisma.contratacion.count({
      where: whereClause,
    });

    // Obtener registros paginados (con filtro de búsqueda)
    const registros = await prisma.contratacion.findMany({
      where: whereClause,
      include: {
        modalidad: true,
      },
      orderBy: {
        fechaGeneracion: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(totalRegistros / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const response = {
      data: registros,
      pagination: {
        currentPage: page,
        totalPages,
        totalRegistros,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      search: search.trim(), // Incluir término de búsqueda en la respuesta
    };

    return NextResponse.json(response);
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
      monto = 0,
      fechaPresentacion,
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
        fechaPresentacion,
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
