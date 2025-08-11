const mongoose = require('mongoose');
require('dotenv').config();

// Import models to ensure they are registered
require('./src/models/User');
require('./src/models/Question');
require('./src/models/Answer');
require('./src/models/Vote');
require('./src/models/Activity');
require('./src/models/SavedContent');

const testModels = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Test model registration
    console.log('📋 Testing model registration...');
    
    const models = mongoose.modelNames();
    console.log('Registered models:', models);
    
    // Test if we can create instances
    const User = mongoose.model('User');
    const Question = mongoose.model('Question');
    const Answer = mongoose.model('Answer');
    const Vote = mongoose.model('Vote');
    const Activity = mongoose.model('Activity');
    const SavedContent = mongoose.model('SavedContent');
    
    console.log('✅ All models are properly registered');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing models:', error);
    process.exit(1);
  }
};

testModels();
