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

    const modalidadEtapaActualizada = await (prisma as any).modalidadEtapa.update({
      where: { id },
      data: {
        eliminado: true,
      },
    });

    return NextResponse.json(
      {
        message: "Modalidad etapa eliminada correctamente",
        modalidadEtapa: modalidadEtapaActualizada,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /modalidades-etapas/:id:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "La modalidad etapa no existe" },
        { status: 404 }
      );
    }

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
    const { etapaId, cantidad, modalidadId, usuarioModificacion,habilitado } = body;

    const datosActualizacion: any = {};
    if (typeof etapaId !== "undefined") datosActualizacion.etapaId = etapaId;
    if (typeof cantidad !== "undefined") datosActualizacion.cantidad = cantidad;
    if (typeof modalidadId !== "undefined") datosActualizacion.modalidadId = modalidadId;
    if (typeof usuarioModificacion !== "undefined")
      datosActualizacion.usuarioModificacion = usuarioModificacion;
    if (typeof habilitado !== "undefined")
      datosActualizacion.habilitado = habilitado;

    if (Object.keys(datosActualizacion).length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    // Validar que no exista otro registro con misma modalidadId y etapaId (eliminado = false)
    if (etapaId || modalidadId) {
      const newEtapaId = etapaId || (await (prisma as any).modalidadEtapa.findUnique({ where: { id } })).etapaId;
      const newModalidadId = modalidadId || (await (prisma as any).modalidadEtapa.findUnique({ where: { id } })).modalidadId;

      const existente = await (prisma as any).modalidadEtapa.findFirst({
        where: {
          etapaId: newEtapaId,
          modalidadId: newModalidadId,
          eliminado: false,
          NOT: { id },
        },
      });

      if (existente) {
        return NextResponse.json(
          { error: "Ya existe un registro con esta modalidad y etapa" },
          { status: 400 }
        );
      }
    }

    const modalidadEtapaActualizada = await (prisma as any).modalidadEtapa.update({
      where: { id },
      data: datosActualizacion,
    });

    return NextResponse.json(modalidadEtapaActualizada);
  } catch (error: any) {
    console.error("Error en PATCH /modalidades-etapas/:id:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "La modalidad etapa no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
