// Firebase configuration for frontend
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDH_S7aWh-o89tlSPHKvz__F0eG-hEx1L8",
  authDomain: "some-b8135.firebaseapp.com",
  projectId: "some-b8135",
  storageBucket: "some-b8135.firebasestorage.app",
  messagingSenderId: "257352443658",
  appId: "1:257352443658:web:381f3d1a55ece45b067cf3",
  measurementId: "G-T9JJEJTSB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Firebase Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOut = () => firebaseSignOut(auth);
export const sendPasswordResetEmail = (email: string) => firebaseSendPasswordResetEmail(auth, email);
export const createUser = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export default app;
