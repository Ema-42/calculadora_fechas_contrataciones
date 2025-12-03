import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { parse } from "cookie";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const cookies = parse(cookieHeader || "");
    const token = cookies.myToken;

    // Verificar si existe el token
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

    const offset = (page - 1) * limit;

  
    const whereClause = search.trim()
      ? {
          eliminado: false, 
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
      : { eliminado: false };

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
      search: search.trim(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error en GET /contratacion:", error?.message || error);

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
    const {
      titulo,
      fechaGeneracion,
      fechaInicio,
      modalidadId,
      monto = 0,
      usuarioCreacion,
      etapas,
    } = body;
    
    console.log("ETAPAS originales:", etapas);
    
    // Transformar etapas de objeto a array de arrays ordenado por fecha
    const etapasTransformadas: [string, string][] = Object.entries(etapas)
      .map(([nombre, fecha]) => [nombre, fecha as string] as [string, string])
      .sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime());
    
    console.log("ETAPAS transformadas:", etapasTransformadas);
    
    const nueva = await prisma.contratacion.create({
      data: {
        titulo,
        fechaGeneracion,
        fechaInicio,
        modalidadId,
        monto,
        usuarioCreacion,
        etapas: etapasTransformadas as any, // o usar JSON.parse(JSON.stringify(etapasTransformadas))
      },
      include: {
        modalidad: true,
      },
    });
    
    console.log("Nueva contratacion creada:", nueva);
    return NextResponse.json(nueva);
  } catch (error: any) {
    console.error("Error en POST /contratacion:", error?.message || error);
    
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