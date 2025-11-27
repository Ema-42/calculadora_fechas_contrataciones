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

    const modalidadActualizada = await (prisma as any).modalidad.update({
      where: { id },
      data: {
        eliminado: true,
      },
    });

    return NextResponse.json(
      {
        message: "Modalidad eliminada correctamente",
        modalidad: modalidadActualizada,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /modalidades/:id:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "La modalidad no existe" },
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
    const { nombre } = body;

    if (!nombre || typeof nombre !== "string") {
      return NextResponse.json(
        { error: "El nombre es obligatorio y debe ser un string" },
        { status: 400 }
      );
    }

    // Verificar duplicados (mismo nombre y no eliminado)
    const existente = await (prisma as any).modalidad.findFirst({
      where: {
        nombre: nombre.trim(),
        eliminado: false,
        NOT: { id },
      },
    });
    console.log("BODY en el ser: ", req.body);

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe otra modalidad con este nombre" },
        { status: 400 }
      );
    }

    const modalidadActualizada = await (prisma as any).modalidad.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
      },
    });

    return NextResponse.json(modalidadActualizada);
  } catch (error: any) {
    console.error("Error en PATCH /modalidades/:id:", error?.message || error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "La modalidad no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
