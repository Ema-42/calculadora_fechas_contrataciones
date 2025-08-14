// lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30min";

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JWTError";
  }
}

// Generar token
export function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  if (!JWT_SECRET) {
    throw new JWTError("JWT_SECRET no está configurado");
  }

  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Verificar token
export function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new JWTError("JWT_SECRET no está configurado");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return { ok: true, data: decoded, message: "Token válido" };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { ok: false, message: "Token expirado", data: null };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { ok: false, message: "Token inválido", data: null };
    }
    throw { ok: false, message: "Error al verificar token", data: null };
  }
}
