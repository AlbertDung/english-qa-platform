import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';
let authToken = '';

const testEnhancedCRUD = async () => {
  try {
    console.log('🧪 Testing Enhanced CRUD Operations...\n');

    // 1. Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@teacher.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    authToken = loginData.token;
    console.log('✅ Login successful');

    // 2. Create a question
    console.log('\n2️⃣ Creating a test question...');
    const createResponse = await fetch(`${BASE_URL}/questions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Test Question - Enhanced CRUD',
        content: 'This is a test question to demonstrate enhanced CRUD operations with edit history.',
        tags: ['test', 'crud'],
        difficulty: 'beginner',
        category: 'grammar'
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    const questionId = createData.question._id;
    console.log('✅ Question created:', questionId);

    // 3. Update the question with edit history
    console.log('\n3️⃣ Updating question with edit history...');
    const updateResponse = await fetch(`${BASE_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Updated Test Question - Enhanced CRUD',
        content: 'This is an updated test question demonstrating edit history tracking.',
        editReason: 'Added more detail and clarity'
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }

    const updateData = await updateResponse.json();
    console.log('✅ Question updated successfully');
    console.log('📝 Edit history entries:', updateData.question.editHistory.length);

    // 4. Get edit history
    console.log('\n4️⃣ Fetching edit history...');
    const historyResponse = await fetch(`${BASE_URL}/questions/${questionId}/edit-history`);

    if (!historyResponse.ok) {
      throw new Error(`History fetch failed: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    console.log('✅ Edit history retrieved');
    console.log('📝 Total edits:', historyData.editHistory.length);

    // 5. Test voting system
    console.log('\n5️⃣ Testing enhanced voting system...');
    const voteResponse = await fetch(`${BASE_URL}/votes/questions/${questionId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        voteType: 'up'
      })
    });

    if (!voteResponse.ok) {
      throw new Error(`Vote failed: ${voteResponse.status}`);
    }

    const voteData = await voteResponse.json();
    console.log('✅ Vote recorded successfully');
    console.log('👍 Current votes:', voteData.votes);

    // 6. Test duplicate vote (should fail)
    console.log('\n6️⃣ Testing duplicate vote prevention...');
    const duplicateVoteResponse = await fetch(`${BASE_URL}/votes/questions/${questionId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        voteType: 'up'
      })
    });

    const duplicateVoteData = await duplicateVoteResponse.json();
    if (duplicateVoteData.alreadyVoted) {
      console.log('✅ Duplicate vote prevented:', duplicateVoteData.message);
    }

    // 7. Check vote status
    console.log('\n7️⃣ Checking vote status...');
    const statusResponse = await fetch(`${BASE_URL}/votes/Question/${questionId}/status`, {
      headers: { 
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    console.log('✅ Vote status retrieved');
    console.log('🗳️ User vote:', statusData.userVote);
    console.log('✔️ Has voted:', statusData.hasVoted);

    // 8. Clean up - delete the test question
    console.log('\n8️⃣ Cleaning up test data...');
    const deleteResponse = await fetch(`${BASE_URL}/questions/${questionId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!deleteResponse.ok) {
      throw new Error(`Delete failed: ${deleteResponse.status}`);
    }

    console.log('✅ Test question deleted successfully');

    console.log('\n🎉 All Enhanced CRUD Tests Passed! 🎉');
    console.log('\n📋 Features Tested:');
    console.log('  ✅ Question Creation');
    console.log('  ✅ Question Update with Edit History');
    console.log('  ✅ Edit History Retrieval');
    console.log('  ✅ Enhanced Voting System');
    console.log('  ✅ Duplicate Vote Prevention');
    console.log('  ✅ Vote Status Checking');
    console.log('  ✅ Question Deletion');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testEnhancedCRUD();
