import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    // If no MongoDB URI provided, try to connect to local MongoDB first
    if (!mongoUri || mongoUri.includes('<username>')) {
      console.log('⚠️ No MongoDB URI found in environment variables');
      console.log('🔄 Attempting to connect to local MongoDB...');
      
      try {
        // Try local MongoDB first
        const conn = await mongoose.connect('mongodb://localhost:27017/english-qa-platform');
        console.log(`✅ Connected to local MongoDB: ${conn.connection.host}`);
        return;
      } catch (localError) {
        console.log('❌ Local MongoDB not available, falling back to in-memory database...');
        
        // Only use in-memory database as last resort
        try {
          const { connectTestDB } = await import('./testDatabase');
          await connectTestDB();
          return;
        } catch (memoryError) {
          console.error('❌ Failed to start in-memory database:', memoryError);
          throw new Error('No database connection available');
        }
      }
    }

    // Use provided MongoDB URI (Atlas or other remote)
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
