import { firebaseAdmin } from '../config/firebaseconfig';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/helpers';

export interface FirebaseUserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: string;
}

/**
 * Verify Firebase ID token and get user data
 */
export const verifyFirebaseToken = async (idToken: string): Promise<FirebaseUserData> => {
  try {
    // Check if Firebase is properly initialized
    if (!firebaseAdmin.apps.length) {
      throw new Error('Firebase Admin not initialized');
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email!,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
      provider: decodedToken.firebase.sign_in_provider
    };
  } catch (error: any) {
    console.error('Firebase token verification error:', error);
    if (error.message.includes('Firebase Admin not initialized')) {
      throw new Error('Firebase authentication is not properly configured');
    }
    throw new Error('Invalid Firebase token');
  }
};

/**
 * Find or create user from Firebase authentication
 */
export const findOrCreateFirebaseUser = async (firebaseData: FirebaseUserData): Promise<{ user: IUser; token: string; isNewUser: boolean }> => {
  try {
    // First, try to find user by Firebase UID
    let user = await User.findOne({ firebaseUid: firebaseData.uid });
    let isNewUser = false;

    if (!user) {
      // If not found by UID, try to find by email (existing local user)
      user = await User.findOne({ email: firebaseData.email });
      
      if (user) {
        // Link existing local account with Firebase
        user.firebaseUid = firebaseData.uid;
        user.authProvider = firebaseData.provider === 'google.com' ? 'google' : 'firebase';
        if (firebaseData.photoURL && !user.avatar) {
          user.avatar = firebaseData.photoURL;
        }
        await user.save();
      } else {
        // Create new user
        isNewUser = true;
        user = await User.create({
          username: generateUsernameFromEmail(firebaseData.email, firebaseData.displayName),
          email: firebaseData.email,
          firebaseUid: firebaseData.uid,
          authProvider: firebaseData.provider === 'google.com' ? 'google' : 'firebase',
          avatar: firebaseData.photoURL || '',
          role: 'student'
        });
      }
    }

    // Generate JWT token for our system
    const token = generateToken(user._id.toString());

    return { user, token, isNewUser };
  } catch (error: any) {
    throw new Error(`Failed to create/find user: ${error.message}`);
  }
};

/**
 * Generate username from email and display name
 */
const generateUsernameFromEmail = (email: string, displayName?: string): string => {
  if (displayName) {
    // Clean display name and use it
    const cleanName = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName.length >= 3) {
      return cleanName;
    }
  }
  
  // Fallback to email prefix
  const emailPrefix = email.split('@')[0].replace(/[^a-z0-9]/g, '');
  return emailPrefix + Math.floor(Math.random() * 1000);
};

/**
 * Handle password reset with Firebase
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await firebaseAdmin.auth().generatePasswordResetLink(email);
  } catch (error: any) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

/**
 * Update user's email in Firebase
 */
export const updateFirebaseEmail = async (uid: string, newEmail: string): Promise<void> => {
  try {
    await firebaseAdmin.auth().updateUser(uid, { email: newEmail });
  } catch (error: any) {
    throw new Error(`Failed to update email in Firebase: ${error.message}`);
  }
};

/**
 * Delete user from Firebase
 */
export const deleteFirebaseUser = async (uid: string): Promise<void> => {
  try {
    await firebaseAdmin.auth().deleteUser(uid);
  } catch (error: any) {
    throw new Error(`Failed to delete Firebase user: ${error.message}`);
  }
};
