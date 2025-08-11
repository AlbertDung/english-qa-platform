import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({}).select('+password');
    console.log('\n👥 Users in database:');
    
    users.forEach(user => {
      console.log(`- ${user.email} (${user.username}) - Role: ${user.role}`);
      console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
    });
    
    console.log(`\n📊 Total users: ${users.length}`);
    
    // Test specific user
    const testUser = await User.findOne({ email: 'john@teacher.com' }).select('+password');
    if (testUser) {
      console.log('\n🔍 Test user found:');
      console.log(`Email: ${testUser.email}`);
      console.log(`Username: ${testUser.username}`);
      console.log(`Role: ${testUser.role}`);
      console.log(`Password hash: ${testUser.password}`);
      
      // Test password comparison
      const isMatch = await testUser.comparePassword('password123');
      console.log(`Password match: ${isMatch}`);
    } else {
      console.log('\n❌ Test user not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

checkUsers();
