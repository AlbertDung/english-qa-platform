# English Q&A Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

A community-driven English learning platform where students and teachers can ask questions, provide answers, and learn together. Similar to Stack Overflow but specifically designed for English language learning.

🔗 **Repository**: [https://github.com/AlbertDung/english-qa-platform](https://github.com/AlbertDung/english-qa-platform)

## Features

### Core Features
- 🔐 **User Authentication** - Register and login system
- ❓ **Ask Questions** - Post English learning questions with categories and difficulty levels
- 💬 **Answer Questions** - Provide helpful answers to community questions
- 🗳️ **Voting System** - Upvote/downvote questions and answers
- ✅ **Accept Answers** - Question authors can mark the best answer
- 🎯 **Categorization** - Grammar, Vocabulary, Pronunciation, Writing, Speaking, Reading, Listening
- 📊 **Reputation System** - Build reputation through helpful contributions

### Advanced Features
- 🔍 **Search & Filter** - Find questions by category, difficulty, or keywords
- 🏷️ **Tagging System** - Organize questions with relevant tags
- 👥 **User Roles** - Student, Teacher, Admin roles with different permissions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🤖 **AI Integration Ready** - Structure prepared for AI-powered features

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS, Helmet, Rate Limiting** for security

## Project Structure

```
english-qa-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/english-qa-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/english-qa-platform`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Answers
- `POST /api/answers/questions/:questionId/answers` - Create answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `PATCH /api/answers/:id/accept` - Accept answer

### Voting
- `POST /api/votes/questions/:id` - Vote on question
- `POST /api/votes/answers/:id` - Vote on answer

## Usage Examples

### Sample Question Categories
- **Grammar**: "When do I use 'a' vs 'an'?"
- **Vocabulary**: "What's the difference between 'big' and 'large'?"
- **Pronunciation**: "How do I pronounce 'though'?"
- **Writing**: "How can I improve my essay structure?"
- **Speaking**: "Tips for reducing my accent?"

### User Roles
- **Student**: Ask questions, answer questions, vote
- **Teacher**: All student permissions + moderation capabilities
- **Admin**: Full system access

## Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Future Enhancements

### AI Integration
- AI-powered answer suggestions
- Grammar checking for questions/answers
- Automated content moderation
- Personalized learning recommendations

### Additional Features
- Real-time notifications
- Private messaging between users
- Achievement badges and gamification
- Advanced search with NLP
- Mobile app (React Native)
- Audio/video content support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help with setup, please create an issue in the GitHub repository.

---

**Happy Learning! 🎓📚**
