import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, validateEmail } from '../utils/helpers';
import { 
  verifyFirebaseToken, 
  findOrCreateFirebaseUser,
  sendPasswordResetEmail 
} from '../services/firebaseAuthService';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email and password' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'student'
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        reputation: user.reputation
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        reputation: user.reputation
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        reputation: user.reputation,
        avatar: user.avatar,
        authProvider: user.authProvider,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Firebase Authentication Endpoints

/**
 * Login/Register with Firebase (Google OAuth, etc.)
 */
export const firebaseAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    // Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(idToken);
    
    // Find or create user in our MongoDB
    const { user, token, isNewUser } = await findOrCreateFirebaseUser(firebaseUser);

    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        reputation: user.reputation,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Send password reset email via Firebase
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email address' });
    }

    // Send password reset email via Firebase
    await sendPasswordResetEmail(email);

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Link local account with Firebase
 */
export const linkFirebaseAccount = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const userId = (req as any).user.id;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    // Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(idToken);
    
    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if Firebase account is already linked to another user
    const existingFirebaseUser = await User.findOne({ firebaseUid: firebaseUser.uid });
    if (existingFirebaseUser && existingFirebaseUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'This Firebase account is already linked to another user' });
    }

    // Link Firebase account
    user.firebaseUid = firebaseUser.uid;
    user.authProvider = firebaseUser.provider === 'google.com' ? 'google' : 'firebase';
    if (firebaseUser.photoURL && !user.avatar) {
      user.avatar = firebaseUser.photoURL;
    }
    
    await user.save();

    res.json({
      success: true,
      message: 'Firebase account linked successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        reputation: user.reputation,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
