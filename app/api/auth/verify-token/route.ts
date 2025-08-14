// app/api/auth/verify-token/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  const cookieStore = cookies();
  const myToken = cookieStore.get("myToken")?.value;
  if (!myToken) {
    return NextResponse.json(
      { ok: false, message: "No autenticado" },
      { status: 401 }
    );
  }

  const { ok } = verifyToken(myToken);

  if (!ok) {
    return NextResponse.json(
      { ok: false, message: "Token inválido o expirado" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}
