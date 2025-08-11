import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectTestDB = async () => {
  try {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    console.log('🚀 Starting in-memory MongoDB for testing...');
    console.log('📡 MongoDB URI:', mongoUri);

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to in-memory MongoDB');
    
    return mongoUri;
  } catch (error) {
    console.error('❌ Error connecting to test database:', error);
    process.exit(1);
  }
};

export const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('🔌 Disconnected from test database');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
};

export default { connectTestDB, disconnectTestDB };
