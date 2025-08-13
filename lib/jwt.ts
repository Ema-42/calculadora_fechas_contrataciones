// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
//const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTError';
  }
}

// Generar token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  if (!JWT_SECRET) {
    throw new JWTError('JWT_SECRET no está configurado');
  }
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Verificar token
export function verifyToken(token: string): JWTPayload {
  if (!JWT_SECRET) {
    throw new JWTError('JWT_SECRET no está configurado');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new JWTError('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new JWTError('Token inválido');
    }
    throw new JWTError('Error al verificar token');
  }
}