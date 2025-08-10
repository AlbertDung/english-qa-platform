import mongoose from 'mongoose';
import { connectTestDB } from './testDatabase';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    // If no MongoDB URI provided, use in-memory database for testing
    if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('localhost:27017')) {
      console.log('🧪 Using in-memory MongoDB for testing...');
      await connectTestDB();
      return;
    }

    // Use provided MongoDB URI (Atlas or local)
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    console.log('🔄 Falling back to in-memory database...');
    await connectTestDB();
  }
};

export default connectDB;
