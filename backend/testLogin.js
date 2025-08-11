import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('🔍 Testing login API...');
    
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john@teacher.com',
        password: 'password123'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.text();
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed!');
    }
  } catch (error) {
    console.error('🚨 Error:', error);
  }
};

testLogin();
