// lib/firebase/auth.ts
import { 
  sendPasswordResetEmail, 
  confirmPasswordReset, 
  verifyPasswordResetCode 
} from "firebase/auth";
import { auth } from "@/app/firebase/config"; // Tu archivo de configuración existente

// Función para enviar email de restablecimiento
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email, {
      // Opcional: personalizar la URL de callback
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });
  } catch (error: any) {
    console.error("Error al enviar email de restablecimiento:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Función para verificar código de restablecimiento
export const verifyResetCode = async (code: string): Promise<string> => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    return email;
  } catch (error: any) {
    console.error("Error al verificar código:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Función para confirmar nueva contraseña
export const resetPassword = async (code: string, newPassword: string): Promise<void> => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
  } catch (error: any) {
    console.error("Error al restablecer contraseña:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Mensajes de error en español
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo electrónico';
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido';
    case 'auth/expired-action-code':
      return 'El código de restablecimiento ha expirado';
    case 'auth/invalid-action-code':
      return 'El código de restablecimiento no es válido';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta más tarde';
    default:
      return 'Ha ocurrido un error inesperado';
  }
};