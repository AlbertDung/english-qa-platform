import { signInWithGoogle, sendPasswordResetEmail } from '../config/firebase';
import api from './api';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    reputation: number;
    avatar?: string;
  };
  isNewUser?: boolean;
}

export interface FirebaseAuthService {
  loginWithGoogle: () => Promise<AuthResponse>;
  loginWithFirebase: (email: string, password: string) => Promise<AuthResponse>;
  registerWithFirebase: (email: string, password: string, username: string, role?: string) => Promise<AuthResponse>;
  sendPasswordReset: (email: string) => Promise<void>;
}

class FirebaseAuthServiceImpl implements FirebaseAuthService {
  /**
   * Login/Register with Google OAuth
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();

      // Send Firebase ID token to backend
      const response = await api.post('/auth/firebase/google', {
        idToken
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google authentication failed');
    }
  }

  /**
   * Login with Firebase Email/Password
   */
  async loginWithFirebase(email: string, password: string): Promise<AuthResponse> {
    try {
      // First try local authentication
      const localResponse = await api.post('/auth/login', { email, password });
      return localResponse.data;
    } catch (localError: any) {
      // If local auth fails, try Firebase auth
      try {
        const { signInWithEmail } = await import('../config/firebase');
        const result = await signInWithEmail(email, password);
        const idToken = await result.user.getIdToken();

        const response = await api.post('/auth/firebase/login', {
          idToken
        });

        return response.data;
      } catch (firebaseError: any) {
        throw new Error(localError.response?.data?.message || 'Authentication failed');
      }
    }
  }

  /**
   * Register with Firebase Email/Password
   */
  async registerWithFirebase(email: string, password: string, username: string, role: string = 'student'): Promise<AuthResponse> {
    try {
      const { createUser } = await import('../config/firebase');
      const result = await createUser(email, password);
      const idToken = await result.user.getIdToken();

      // Send Firebase ID token and additional info to backend
      const response = await api.post('/auth/firebase/register', {
        idToken,
        username,
        role
      });

      return response.data;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already registered');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }
      throw new Error('Failed to send password reset email');
    }
  }
}

export const firebaseAuthService = new FirebaseAuthServiceImpl();
