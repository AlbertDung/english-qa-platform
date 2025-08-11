import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Cloudinary Configuration Check ===');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'NOT SET');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '[HIDDEN]' : 'NOT SET');

// Test Cloudinary configuration
try {
  const cloudinary = require('cloudinary').v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('\n=== Testing Cloudinary Connection ===');
  console.log('Cloudinary config loaded successfully');
  
  // Test API connection
  cloudinary.api.ping()
    .then((result) => {
      console.log('✅ Cloudinary connection successful:', result);
    })
    .catch((error) => {
      console.error('❌ Cloudinary connection failed:', error.message);
    });
    
} catch (error) {
  console.error('❌ Cloudinary setup error:', error.message);
}
