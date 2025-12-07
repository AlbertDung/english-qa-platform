// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';


// Import models to ensure they are registered
import './models/User';
import './models/Question';
import './models/Answer';
import './models/Vote';
import './models/Activity';
import './models/SavedContent';
import './models/Exercise';

import connectDB from './utils/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import questionRoutes from './routes/questions';
import answerRoutes from './routes/answers';
import voteRoutes from './routes/votes';
import uploadRoutes from './routes/upload';
import userRoutes from './routes/user';
import exerciseRoutes from './routes/exercises';

// Connect to database (non-blocking - server will start even if DB connection is pending)
connectDB().catch((error) => {
  console.error('Failed to connect to database:', error);
  // Don't exit - allow server to start, but API endpoints will fail
});

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS - Allow multiple origins for development and production
const isProduction = process.env.NODE_ENV === 'production';
let allowedOrigins: (string | RegExp)[] = [];

if (process.env.CLIENT_URL) {
  // Use explicitly configured CLIENT_URL (comma-separated for multiple origins)
  allowedOrigins = process.env.CLIENT_URL.split(',').map(url => url.trim());
} else if (isProduction) {
  // In production, CLIENT_URL must be explicitly configured
  console.error('❌ ERROR: CLIENT_URL environment variable is required in production!');
  console.error('   Please set CLIENT_URL to your frontend URL(s), e.g., CLIENT_URL=https://yourdomain.com');
  console.error('   Server will start but CORS will reject all requests until CLIENT_URL is configured.');
  // Don't exit - allow server to start but CORS will reject requests
  allowedOrigins = [];
} else {
  // Development defaults: only use when CLIENT_URL is not set and not in production
  allowedOrigins = ['http://localhost:3000'];
  
  // Add local network IPs for development (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  allowedOrigins.push(/^http:\/\/192\.168\.\d+\.\d+:3000$/);
  allowedOrigins.push(/^http:\/\/10\.\d+\.\d+\.\d+:3000$/);
  allowedOrigins.push(/^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:3000$/);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '8080', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
