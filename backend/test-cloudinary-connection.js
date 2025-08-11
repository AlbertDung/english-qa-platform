const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('=== Testing Cloudinary Connection ===');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);

// Test the connection
cloudinary.api.ping()
  .then((result) => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    if (error.http_code) {
      console.error('HTTP Code:', error.http_code);
    }
    process.exit(1);
  });
