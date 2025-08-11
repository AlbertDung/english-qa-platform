# English Q&A Platform 🎓

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.5.0-green)](https://www.mongodb.com/)

A modern, community-driven English learning platform where students and teachers can ask questions, provide answers, and learn together. Built with React, Node.js, and MongoDB for a seamless learning experience.

🔗 **Live Demo**: [Coming Soon](#)
📚 **Documentation**: [API Docs](./backend/API_DOCUMENTATION.md)
🚀 **Deployment**: [Railway Backend](./RAILWAY_DEPLOYMENT_GUIDE.md) | [Vercel Frontend](#)

## ✨ Features

### 🎯 Core Learning Features
- **📝 Question Management** - Ask, edit, and categorize English learning questions
- **💡 Answer System** - Provide detailed answers with rich text formatting
- **🏷️ Smart Categorization** - Grammar, Vocabulary, Pronunciation, Writing, Speaking, Reading, Listening
- **⭐ Voting & Reputation** - Build credibility through helpful contributions
- **✅ Best Answer Selection** - Mark the most helpful answer for each question

### 🔐 User Management
- **👤 Authentication** - Secure JWT-based login/registration
- **👥 Role-Based Access** - Student, Teacher, and Admin roles
- **📊 User Profiles** - Track learning progress and contributions
- **🔒 Content Moderation** - Teachers can moderate content

### 🚀 Advanced Features
- **🔍 Smart Search** - Find questions by category, difficulty, or keywords
- **📱 Responsive Design** - Optimized for all devices
- **🤖 AI Integration Ready** - Prepared for AI-powered learning features
- **📁 File Uploads** - Support for images and documents
- **📊 Activity Feed** - Track community engagement

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18** with TypeScript for type safety
- **🎨 Tailwind CSS** for modern, responsive styling
- **🔄 React Router** for seamless navigation
- **📡 Axios** for reliable API communication
- **⚡ Context API** for efficient state management

### Backend
- **🟢 Node.js** with Express framework
- **🔷 TypeScript** for robust backend development
- **🍃 MongoDB** with Mongoose ODM
- **🔐 JWT** for secure authentication
- **🔒 bcryptjs** for password security
- **🛡️ Security** - CORS, Helmet, Rate Limiting

### Database & Services
- **🗄️ MongoDB Atlas** - Cloud database hosting
- **☁️ Cloudinary** - Image and file storage
- **🤖 OpenAI/Google AI** - AI-powered features
- **🚀 Railway** - Backend hosting
- **⚡ Vercel** - Frontend hosting

## 📁 Project Structure

```
english-qa-platform/
├── 📂 backend/                 # Node.js + Express API
│   ├── 📂 src/
│   │   ├── 🎮 controllers/     # Route handlers
│   │   ├── 🗃️ models/         # MongoDB schemas
│   │   ├── 🛣️ routes/         # API endpoints
│   │   ├── 🛡️ middleware/     # Custom middleware
│   │   ├── 🔧 services/        # Business logic
│   │   ├── 🛠️ utils/          # Helper functions
│   │   └── 🚀 server.ts        # Main server file
│   ├── 📄 package.json
│   ├── ⚙️ tsconfig.json
│   └── 🔑 .env.example
├── 📂 frontend/                # React + TypeScript App
│   ├── 📂 src/
│   │   ├── 🧩 components/      # Reusable UI components
│   │   ├── 📄 pages/          # Page components
│   │   ├── 🔄 contexts/       # React contexts
│   │   ├── 📡 services/       # API services
│   │   ├── 🏷️ types/          # TypeScript types
│   │   └── 🎯 App.tsx         # Main app component
│   ├── 📄 package.json
│   ├── ⚙️ tsconfig.json
│   └── 🎨 tailwind.config.js
└── 📄 README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AlbertDung/english-qa-platform.git
cd english-qa-platform
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/english-qa-platform
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/english-qa?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:3000

# Optional: AI Services
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional: Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Start the Backend:**
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

✅ **Backend running on:** `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ **Frontend running on:** `http://localhost:3000`

### 4️⃣ Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify it's running
sudo systemctl status mongodb
```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster (free tier available)
3. Get connection string
4. Update `MONGODB_URI` in your `.env` file

## 📚 Available Scripts

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript for production
npm start        # Start production server
npm test         # Run test suite
npm run seed     # Seed database with sample data
```

### Frontend Scripts
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run test suite
npm run eject    # Eject from Create React App (not recommended)
```

## 🌐 API Endpoints

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

📖 **Full API Documentation:** [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## 🎯 Usage Examples

### Sample Question Categories
- **📚 Grammar**: "When do I use 'a' vs 'an'?"
- **📖 Vocabulary**: "What's the difference between 'big' and 'large'?"
- **🗣️ Pronunciation**: "How do I pronounce 'though'?"
- **✍️ Writing**: "How can I improve my essay structure?"
- **💬 Speaking**: "Tips for reducing my accent?"

### User Roles & Permissions
- **👨‍🎓 Student**: Ask questions, answer questions, vote, build reputation
- **👨‍🏫 Teacher**: All student permissions + content moderation, answer verification
- **👨‍💼 Admin**: Full system access, user management, system configuration

## 🚀 Deployment

### Backend Deployment (Railway)
📖 **Complete Guide:** [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)

### Frontend Deployment (Vercel)
📖 **Complete Guide:** Coming Soon

## 🔮 Future Enhancements

### 🤖 AI Integration
- AI-powered answer suggestions
- Grammar checking for questions/answers
- Automated content moderation
- Personalized learning recommendations
- Speech recognition for pronunciation

### 🚀 Additional Features
- Real-time notifications
- Private messaging between users
- Achievement badges and gamification
- Advanced search with NLP
- Mobile app (React Native)
- Audio/video content support
- Multi-language support

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md).

### How to Contribute
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 🚀 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support & Community

- 🐛 **Bug Reports**: [Create an issue](https://github.com/AlbertDung/english-qa-platform/issues)
- 💡 **Feature Requests**: [Create an issue](https://github.com/AlbertDung/english-qa-platform/issues)
- 📖 **Documentation**: [API Docs](./backend/API_DOCUMENTATION.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/AlbertDung/english-qa-platform/discussions)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the robust database
- Express.js team for the lightweight server framework
- Tailwind CSS team for the utility-first CSS framework
- All contributors who help improve this platform

---

**🎓 Happy Learning! Let's make English learning accessible to everyone! 📚✨**

<div align="center">
  <sub>Built with ❤️ by the English Q&A Platform community</sub>
</div>
