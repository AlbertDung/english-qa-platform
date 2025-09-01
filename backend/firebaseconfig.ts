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
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
}

export const firebaseAdmin = admin;
export default firebaseAdmin;