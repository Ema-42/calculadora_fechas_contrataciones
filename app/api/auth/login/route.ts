import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();

    // Generar JWT
    const token = generateToken({
      userId: user.uid,
      email: user.email,
    });

    const isProd = process.env.NODE_ENV === "production";

    // Serializar cookie (ajustada por entorno)
    const serialized = serialize("myToken", token, {
      httpOnly: true,
      secure: isProd,                    // HTTPS solo en producción
      sameSite: isProd ? "none" : "lax", // Dev permisivo / Prod compatible SPA
      path: "/",
      maxAge: 60 * 60 * 24 * 7,           // 1 semana
    });

    const response = NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        email: user.email,
      },
    });

    response.headers.set("Set-Cookie", serialized);

    return response;
  } catch (error: any) {
    console.error("Error en login:", error.message);

    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
