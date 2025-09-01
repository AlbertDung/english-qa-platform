import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { verifyFirebaseToken } from '../services/firebaseAuthService';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Try to verify as JWT token first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      req.user = user;
      return next();
    } catch (jwtError) {
      // If JWT verification fails, try Firebase token verification
      try {
        const firebaseUser = await verifyFirebaseToken(token);
        const user = await User.findOne({ firebaseUid: firebaseUser.uid }).select('-password');

        if (!user) {
          return res.status(401).json({ message: 'Firebase user not found in database' });
        }

        req.user = user;
        return next();
      } catch (firebaseError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    next();
  };
};
