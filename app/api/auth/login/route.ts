// app/api/auth/login/route.ts
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

    // Serializar cookie
    const serialized = serialize("myToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    // Crear respuesta y agregar cookie
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

    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
