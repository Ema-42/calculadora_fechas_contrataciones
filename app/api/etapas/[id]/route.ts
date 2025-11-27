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

    const etapaActualizada = await (prisma as any).etapas.update({
      where: { id },
      data: {
        eliminado: true,
      },
    });

    return NextResponse.json(
      {
        message: "Etapa eliminada correctamente",
        etapa: etapaActualizada,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /etapas:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "La etapa no existe" },
        { status: 404 }
      );
    }

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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "El ID debe ser un número válido" },
        { status: 400 }
      );
    }

    const etapa = await (prisma as any).etapas.findUnique({ where: { id } });

    if (!etapa || etapa.eliminado) {
      return NextResponse.json(
        { error: "Etapa no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(etapa);
  } catch (error: any) {
    console.error("Error en GET /etapas/:id:", error?.message || error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "El ID debe ser un número válido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { nombre, usuarioModificacion, eliminado } = body;

    const datosActualizacion: any = {};
    if (typeof nombre !== "undefined") datosActualizacion.nombre = nombre;
    if (typeof usuarioModificacion !== "undefined")
      datosActualizacion.usuarioModificacion = usuarioModificacion;
    if (typeof eliminado !== "undefined")
      datosActualizacion.eliminado = eliminado;

    if (Object.keys(datosActualizacion).length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    const etapaActualizada = await (prisma as any).etapas.update({
      where: { id },
      data: datosActualizacion,
    });

    return NextResponse.json(etapaActualizada);
  } catch (error: any) {
    console.error("Error en PATCH /etapas/:id:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "La etapa no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
