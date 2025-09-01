// Firebase Admin SDK Configuration for Backend
import * as admin from 'firebase-admin';

// Firebase client configuration for frontend integration
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_I,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
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
          projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
          projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
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
        projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
      });
    }
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
    console.log('Some authentication features may not work properly');
  }
}

export const firebaseAdmin = admin;
export default firebaseAdmin;
