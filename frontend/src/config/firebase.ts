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
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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
