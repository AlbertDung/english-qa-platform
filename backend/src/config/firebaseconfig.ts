// Firebase Admin SDK Configuration for Backend
import * as admin from 'firebase-admin';

// Firebase client configuration for frontend integration
export const firebaseConfig = {
  apiKey: "AIzaSyDH_S7aWh-o89tlSPHKvz__F0eG-hEx1L8",
  authDomain: "some-b8135.firebaseapp.com",
  projectId: "some-b8135",
  storageBucket: "some-b8135.firebasestorage.app",
  messagingSenderId: "257352443658",
  appId: "1:257352443658:web:381f3d1a55ece45b067cf3",
  measurementId: "G-T9JJEJTSB9"
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // For development, initialize without credentials to avoid errors
    // This allows the server to start without Firebase features
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || 
        (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)) {
      
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: firebaseConfig.projectId,
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseConfig.projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
          projectId: firebaseConfig.projectId,
        });
      }
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('No Firebase credentials found. Firebase features will be disabled.');
      console.log('To enable Firebase features, either:');
      console.log('1. Set GOOGLE_APPLICATION_CREDENTIALS to your service account key file path, or');
      console.log('2. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables');
      
      // Initialize a mock app to prevent crashes
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
    console.log('Some authentication features may not work properly');
  }
}

export const firebaseAdmin = admin;
export default firebaseAdmin;
