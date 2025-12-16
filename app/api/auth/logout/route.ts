import { verifyToken } from "@/lib/jwt";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    const myToken = cookieStore.get("myToken")?.value;

    if (!myToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { ok } = verifyToken(myToken);

    if (!ok) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const isProd = process.env.NODE_ENV === "production";

    // Eliminar cookie con los MISMOS atributos del login
    const serialized = serialize("myToken", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 0,
    });

    const response = NextResponse.json({
      success: true,
      message: "Cerrar sesión exitoso",
    });

    response.headers.set("Set-Cookie", serialized);

    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);

    return NextResponse.json(
      { success: false, message: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
