import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, validateEmail } from '../utils/helpers';

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
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
