import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  firebaseAuth, 
  forgotPassword, 
  linkFirebaseAccount 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Traditional email/password authentication
router.post('/register', register);
router.post('/login', login);

// Firebase authentication
router.post('/firebase-auth', firebaseAuth);
router.post('/firebase/google', firebaseAuth); // Google OAuth specific endpoint
router.post('/firebase/login', firebaseAuth);  // Firebase email/password login
router.post('/firebase/register', firebaseAuth); // Firebase email/password register
router.post('/forgot-password', forgotPassword);
router.post('/link-firebase', authenticate, linkFirebaseAccount);

// Test route to debug
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
