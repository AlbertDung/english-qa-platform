import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models to ensure they are registered
import '../models/User';
import '../models/Question';
import '../models/Answer';
import '../models/Vote';
import '../models/Activity';
import '../models/SavedContent';

import User from '../models/User';
import Question from '../models/Question';
import Answer from '../models/Answer';
import Vote from '../models/Vote';

dotenv.config();

const seedAtlasData = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await Vote.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'john_teacher',
        email: 'john@teacher.com',
        password: 'password123', // Let User model hash this
        role: 'teacher',
        reputation: 850
      },
      {
        username: 'sarah_student',
        email: 'sarah@student.com',
        password: 'password123', // Let User model hash this
        role: 'student',
        reputation: 120
      },
      {
        username: 'mike_student',
        email: 'mike@student.com',
        password: 'password123', // Let User model hash this
        role: 'student',
        reputation: 75
      },
      {
        username: 'emma_teacher',
        email: 'emma@teacher.com',
        password: 'password123', // Let User model hash this
        role: 'teacher',
        reputation: 1200
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample questions
    const questions = await Question.create([
      {
        title: 'When to use "a" vs "an" in English?',
        content: 'I\'m confused about when to use "a" versus "an" before nouns. Can someone explain the rule and provide examples?',
        tags: ['articles', 'grammar', 'beginner'],
        author: users[1]._id, // sarah_student
        difficulty: 'beginner',
        category: 'grammar',
        votes: 5,
        viewCount: 23
      },
      {
        title: 'How do I improve my English pronunciation?',
        content: 'I\'ve been studying English for 2 years but native speakers still have trouble understanding me. What are some effective ways to improve pronunciation?',
        tags: ['pronunciation', 'speaking', 'practice'],
        author: users[2]._id, // mike_student
        difficulty: 'intermediate',
        category: 'pronunciation',
        votes: 12,
        viewCount: 67
      },
      {
        title: 'Past Perfect vs Past Simple - When to use each?',
        content: 'I understand how to form past perfect and past simple, but I struggle with knowing when to use each one. Could someone explain with examples?',
        tags: ['tenses', 'past-perfect', 'past-simple', 'grammar'],
        author: users[1]._id, // sarah_student
        difficulty: 'intermediate',
        category: 'grammar',
        votes: 8,
        viewCount: 45
      },
      {
        title: 'Best resources for IELTS Writing Task 2?',
        content: 'I\'m preparing for IELTS and struggling with Writing Task 2. What are the best resources, templates, and practice methods you\'d recommend?',
        tags: ['ielts', 'writing', 'exam-prep', 'academic'],
        author: users[2]._id, // mike_student
        difficulty: 'advanced',
        category: 'writing',
        votes: 15,
        viewCount: 89
      },
      {
        title: 'Common phrasal verbs for daily conversation?',
        content: 'I want to sound more natural in English conversations. What are the most common phrasal verbs I should learn first?',
        tags: ['phrasal-verbs', 'vocabulary', 'conversation'],
        author: users[1]._id, // sarah_student
        difficulty: 'intermediate',
        category: 'vocabulary',
        votes: 7,
        viewCount: 34
      }
    ]);

    console.log('❓ Created sample questions');

    // Create sample answers
    const answers = await Answer.create([
      {
        content: 'Great question! The rule is simple:\n\n• Use "a" before words that start with a consonant SOUND\n• Use "an" before words that start with a vowel SOUND\n\nExamples:\n- "a car" (starts with "c" sound)\n- "an apple" (starts with vowel sound)\n- "a university" (starts with "y" sound, even though "u" is a vowel)\n- "an hour" (silent "h", starts with vowel sound)\n\nRemember, it\'s about the SOUND, not the letter!',
        author: users[0]._id, // john_teacher
        question: questions[0]._id,
        votes: 8,
        isAccepted: true
      },
      {
        content: 'Here are my top tips for pronunciation improvement:\n\n1. **Listen and repeat**: Use apps like Forvo or Google Translate to hear native pronunciation\n2. **Record yourself**: Compare your pronunciation with native speakers\n3. **Focus on problem sounds**: Identify sounds that don\'t exist in your native language\n4. **Learn IPA symbols**: International Phonetic Alphabet helps with accurate pronunciation\n5. **Practice minimal pairs**: Words like "ship/sheep", "bad/bed"\n6. **Watch English media**: Movies, YouTube, podcasts with subtitles\n\nConsistency is key - practice 15-20 minutes daily!',
        author: users[3]._id, // emma_teacher
        question: questions[1]._id,
        votes: 15,
        isAccepted: true
      },
      {
        content: 'I had the same confusion! Here\'s how I learned to differentiate:\n\n**Past Simple**: For completed actions at specific times\n- "I finished my homework yesterday"\n- "She lived in London for 5 years" (but doesn\'t live there now)\n\n**Past Perfect**: For actions completed before another past action\n- "I had finished my homework before dinner"\n- "She had lived in London before moving to Paris"\n\nThink of it as "further back in the past" vs "just in the past".',
        author: users[2]._id, // mike_student
        question: questions[2]._id,
        votes: 5
      },
      {
        content: 'For IELTS Writing Task 2, I recommend:\n\n**Resources:**\n- IELTS Liz website (free templates and tips)\n- Cambridge IELTS books (practice tests)\n- "The Complete Guide to IELTS" by Bruce Rogers\n\n**Structure I use:**\n1. Introduction + thesis statement\n2. Body paragraph 1 (main argument + examples)\n3. Body paragraph 2 (counter-argument or second point)\n4. Conclusion (restate + final thought)\n\n**Tips:**\n- Aim for 280-300 words\n- Use varied vocabulary and sentence structures\n- Practice timed writing (40 minutes max)\n\nGood luck with your exam!',
        author: users[0]._id, // john_teacher
        question: questions[3]._id,
        votes: 12,
        isAccepted: true
      },
      {
        content: 'Here are the most essential phrasal verbs for daily conversation:\n\n**Common ones to start with:**\n- **get up** = wake up and leave bed\n- **turn on/off** = start/stop a device\n- **look for** = search for something\n- **find out** = discover information\n- **give up** = stop trying\n- **put on/off** = wear/postpone\n- **run into** = meet unexpectedly\n- **hang out** = spend time casually\n- **show up** = arrive/appear\n- **come up with** = think of an idea\n\nStart with these 10 and use them in conversations. Once comfortable, add 5 more each week!',
        author: users[3]._id, // emma_teacher
        question: questions[4]._id,
        votes: 9,
        isAccepted: true
      }
    ]);

    console.log('💬 Created sample answers');

    // Update questions with answer references
    for (let i = 0; i < questions.length; i++) {
      const questionAnswers = answers.filter(answer => 
        answer.question.toString() === questions[i]._id.toString()
      );
      
      await Question.findByIdAndUpdate(questions[i]._id, {
        answers: questionAnswers.map(a => a._id),
        acceptedAnswer: questionAnswers.find(a => a.isAccepted)?._id
      });
    }

    // Create some votes
    await Vote.create([
      {
        user: users[1]._id,
        target: questions[0]._id,
        targetType: 'Question',
        voteType: 'up'
      },
      {
        user: users[2]._id,
        target: questions[0]._id,
        targetType: 'Question',
        voteType: 'up'
      },
      {
        user: users[1]._id,
        target: answers[0]._id,
        targetType: 'Answer',
        voteType: 'up'
      },
      {
        user: users[2]._id,
        target: answers[1]._id,
        targetType: 'Answer',
        voteType: 'up'
      }
    ]);

    console.log('👍 Created sample votes');

    console.log('\n🎉 Atlas seed data created successfully!');
    console.log('\n👥 Sample Users:');
    console.log('📧 john@teacher.com (password: password123) - Teacher');
    console.log('📧 sarah@student.com (password: password123) - Student');
    console.log('📧 mike@student.com (password: password123) - Student');
    console.log('📧 emma@teacher.com (password: password123) - Teacher');
    
    console.log('\n❓ Sample Questions: 5 questions created');
    console.log('💬 Sample Answers: 5 answers created');
    console.log('👍 Sample Votes: 4 votes created');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Atlas data:', error);
    process.exit(1);
  }
};

seedAtlasData();
