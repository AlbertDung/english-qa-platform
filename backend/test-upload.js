const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// Test the upload endpoint
async function testUpload() {
  try {
    // First login to get a token
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sarah@student.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful');

    // Create a simple test file buffer
    const testData = Buffer.from('test file content');
    
    const formData = new FormData();
    formData.append('file', testData, {
      filename: 'test.txt',
      contentType: 'text/plain'
    });
    formData.append('context', 'question');

    // Test upload
    const uploadResponse = await fetch('http://localhost:5001/api/upload/single', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();
    console.log('Upload response:', uploadData);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUpload();
