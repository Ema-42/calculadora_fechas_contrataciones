// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
 
import { auth } from '@/app/firebase/config';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Autenticar con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generar JWT
    const token = generateToken({
      userId: user.uid,
      email: user.email || email,
    });

    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });

  } catch (error: any) {
    console.error('Error en login:', error);
    
    // Errores específicos de Firebase Auth
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuario no encontrado';
      statusCode = 404;
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Contraseña incorrecta';
      statusCode = 401;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
      statusCode = 400;
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Usuario deshabilitado';
      statusCode = 403;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}