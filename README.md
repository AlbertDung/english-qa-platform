# English Q&A Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.5.0-green)](https://www.mongodb.com/)
[![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen)](https://englishqnaplatform.vercel.app/)

A modern, community-driven English learning platform where students and teachers can ask questions, provide answers, and learn together. Built with React, Node.js, and MongoDB for a seamless learning experience.

**🌐 Live Demo**: [https://englishqnaplatform.vercel.app/](https://englishqnaplatform.vercel.app/)  
**📚 API Documentation**: [Backend API Docs](./backend/API_DOCUMENTATION.md)  
**🚀 Backend**: [Railway Deployment](./RAILWAY_DEPLOYMENT_GUIDE.md)  
**🎨 Frontend**: [Vercel Deployment](https://englishqnaplatform.vercel.app/)

## ✨ What We've Built

The English Q&A Platform is a full-stack web application that provides a collaborative learning environment for English language students and educators. Our platform enables users to ask questions, provide detailed answers, and engage in meaningful discussions about English grammar, vocabulary, pronunciation, and more.

### 🎯 **Live Features Currently Working**
- **User Authentication System** - Secure JWT-based login/registration
- **Question Management** - Create, edit, and categorize English learning questions
- **Answer System** - Provide detailed answers with rich text formatting
- **Smart Categorization** - Grammar, Vocabulary, Pronunciation, Writing, Speaking, Reading, Listening
- **Voting & Reputation** - Build credibility through helpful contributions
- **Responsive Design** - Optimized for all devices and screen sizes
- **Real-time Updates** - Dynamic content loading and state management

### 🔧 **Technical Achievements**
- **Full-Stack Deployment** - Successfully deployed on Railway (backend) and Vercel (frontend)
- **Database Integration** - MongoDB Atlas with Mongoose ODM
- **API Architecture** - RESTful API with proper error handling and validation
- **Security Implementation** - CORS, JWT authentication, password hashing
- **Performance Optimization** - Efficient data fetching and state management

## 🚀 **Live Deployment Status**

| Component | Status | URL | Technology |
|-----------|--------|-----|------------|
| **Frontend** | ✅ Live | [https://englishqnaplatform.vercel.app/](https://englishqnaplatform.vercel.app/) | React + TypeScript + Tailwind CSS |
| **Backend API** | ✅ Live | [https://backendeqp-production-3b8f.up.railway.app/](https://backendeqp-production-3b8f.up.railway.app/) | Node.js + Express + TypeScript |
| **Database** | ✅ Connected | MongoDB Atlas | Cloud-hosted MongoDB |
| **File Storage** | ✅ Ready | Cloudinary | Image and file hosting |

## 🛠️ **Technology Stack**

### **Frontend Technologies**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development for better code quality
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing for single-page application
- **Axios** - HTTP client for API communication
- **Context API** - State management without external libraries

### **Backend Technologies**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication

### **Infrastructure & Services**
- **Vercel** - Frontend hosting and deployment
- **Railway** - Backend hosting and deployment
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Cloud-based image and file management
- **GitHub** - Version control and project management

## 📱 **Platform Features**

### **Core Learning Features**
- **Question Management System**
  - Ask questions with rich text formatting
  - Categorize by learning areas (Grammar, Vocabulary, etc.)
  - Set difficulty levels (Beginner, Intermediate, Advanced)
  - Add file attachments (images, audio)

- **Answer System**
  - Provide detailed, formatted answers
  - Support for multimedia content
  - Edit history tracking
  - Best answer selection by question authors

- **Community Features**
  - Upvote/downvote system for quality control
  - User reputation building
  - Activity tracking and user profiles
  - Content moderation capabilities

### **User Experience Features**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Search & Filtering** - Find questions by category, difficulty, or keywords
- **Real-time Updates** - Dynamic content loading without page refreshes
- **Accessibility** - Designed with accessibility best practices

### **Advanced Capabilities**
- **File Upload System** - Support for images and audio files
- **Activity Feed** - Track user engagement and contributions
- **User Dashboard** - Personalized learning progress tracking
- **Content Saving** - Bookmark questions and answers for later review
- **Multi-language Ready** - Architecture prepared for internationalization

## 🏗️ **Project Architecture**

```
english-qa-platform/
├── frontend/                 # React + TypeScript Application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── QuestionCard.tsx      # Question display component
│   │   │   ├── AnswerCard.tsx        # Answer display component
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── LoadingSpinner.tsx    # Loading states
│   │   │   └── EnhancedFileUpload.tsx # File upload component
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.tsx          # Main landing page
│   │   │   ├── AskQuestionPage.tsx   # Question creation
│   │   │   ├── QuestionDetailPage.tsx # Question view
│   │   │   ├── Login.tsx             # Authentication
│   │   │   └── UserProfilePage.tsx   # User dashboard
│   │   ├── services/         # API communication
│   │   │   ├── api.ts                # Base API configuration
│   │   │   ├── questionService.ts    # Question API calls
│   │   │   ├── authService.ts        # Authentication API
│   │   │   └── uploadService.ts      # File upload API
│   │   ├── contexts/         # React contexts
│   │   │   ├── AuthContext.tsx       # Authentication state
│   │   │   └── ToastContext.tsx      # Notification system
│   │   └── types/            # TypeScript type definitions
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   │   ├── questionController.ts  # Question logic
│   │   │   ├── answerController.ts    # Answer logic
│   │   │   ├── authController.ts      # Authentication logic
│   │   │   └── userController.ts      # User management
│   │   ├── models/           # MongoDB schemas
│   │   │   ├── Question.ts            # Question data model
│   │   │   ├── Answer.ts              # Answer data model
│   │   │   ├── User.ts                # User data model
│   │   │   └── Vote.ts                # Voting system model
│   │   ├── routes/           # API endpoints
│   │   │   ├── questions.ts           # Question routes
│   │   │   ├── answers.ts             # Answer routes
│   │   │   ├── auth.ts                # Authentication routes
│   │   │   └── users.ts               # User routes
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── auth.ts                # JWT authentication
│   │   │   └── errorHandler.ts        # Error handling
│   │   ├── services/         # Business logic
│   │   │   ├── aiService.ts           # AI integration
│   │   │   └── cloudinaryService.ts   # File upload service
│   │   └── utils/            # Helper functions
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
└── README.md                 # Project documentation
```

## 🚀 **Quick Start Guide**

### **Prerequisites**
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/atlas) (recommended) or local installation
- **Git** - [Download here](https://git-scm.com/)

### **1. Clone the Repository**
```bash
git clone https://github.com/AlbertDung/english-qa-platform.git
cd english-qa-platform
```

### **2. Backend Setup**
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
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/english-qa?retryWrites=true&w=majority

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

**Backend running on:** `http://localhost:5000`

### **3. Frontend Setup**
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend running on:** `http://localhost:3000`

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### **Questions**
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### **Answers**
- `POST /api/answers/questions/:questionId/answers` - Create answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `PATCH /api/answers/:id/accept` - Accept answer

### **Voting**
- `POST /api/votes/questions/:id` - Vote on question
- `POST /api/votes/answers/:id` - Vote on answer

**Full API Documentation:** [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## 🎨 **User Interface Showcase**

Our platform features a modern, intuitive interface designed for optimal learning experiences:

- **Hero Section** - Welcoming banner with call-to-action for asking questions
- **Statistics Dashboard** - Real-time counts of active questions and solved problems
- **Advanced Filtering** - Search by category, difficulty, and keywords
- **Responsive Cards** - Clean question and answer displays
- **Interactive Elements** - Smooth animations and hover effects
- **Mobile-First Design** - Optimized for all device sizes

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Configurable cross-origin resource sharing
- **Rate Limiting** - Protection against abuse and DDoS attacks
- **Input Validation** - Server-side validation for all user inputs
- **XSS Protection** - HTML sanitization for user-generated content

## 📈 **Performance & Scalability**

- **Efficient Database Queries** - Optimized MongoDB operations
- **Lazy Loading** - Progressive content loading
- **Caching Strategy** - Intelligent data caching
- **CDN Integration** - Fast content delivery worldwide
- **Horizontal Scaling** - Architecture ready for load balancing

## 🚀 **Deployment Journey**

### **What We Accomplished**
1. **Backend Deployment** - Successfully deployed Node.js API on Railway
2. **Frontend Deployment** - React app deployed on Vercel with custom domain
3. **Database Setup** - MongoDB Atlas integration with proper security
4. **CORS Configuration** - Resolved cross-origin issues for production
5. **Environment Management** - Proper configuration for different deployment stages
6. **Error Handling** - Comprehensive error handling and user feedback
7. **Performance Optimization** - Optimized for production use

### **Deployment Challenges Solved**
- **Monorepo Structure** - Configured Railway to deploy only backend directory
- **CORS Issues** - Resolved trailing slash mismatches in environment variables
- **Build Commands** - Optimized TypeScript build and start processes
- **Environment Variables** - Proper configuration for production deployment
- **Health Checks** - Implemented API health monitoring endpoints

## 🔮 **Future Roadmap**

### **Phase 1: Enhanced Features**
- **AI Integration** - OpenAI-powered answer suggestions and grammar checking
- **Real-time Chat** - Live discussions and instant messaging
- **Notification System** - Email and push notifications
- **Advanced Analytics** - Learning progress tracking and insights

### **Phase 2: Platform Expansion**
- **Mobile Application** - React Native mobile app
- **Multi-language Support** - Internationalization for global users
- **Video Content** - Video tutorials and pronunciation guides
- **Gamification** - Achievement badges and learning rewards

### **Phase 3: Enterprise Features**
- **Teacher Dashboard** - Advanced classroom management tools
- **Content Moderation** - AI-powered content filtering
- **Analytics Dashboard** - Comprehensive learning analytics
- **API Marketplace** - Third-party integrations and plugins

## 🤝 **Contributing**

We welcome contributions from the community! Please read our [Contributing Guidelines](./CONTRIBUTING.md).

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📞 **Support & Community**

- **Live Platform**: [https://englishqnaplatform.vercel.app/](https://englishqnaplatform.vercel.app/)
- **Bug Reports**: [Create an issue](https://github.com/AlbertDung/english-qa-platform/issues)
- **Feature Requests**: [Create an issue](https://github.com/AlbertDung/english-qa-platform/issues)
- **Documentation**: [API Docs](./backend/API_DOCUMENTATION.md)
- **Discussions**: [GitHub Discussions](https://github.com/AlbertDung/english-qa-platform/discussions)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 **Acknowledgments**

- **React Team** - For the amazing frontend framework
- **MongoDB Team** - For the robust database solution
- **Express.js Team** - For the lightweight server framework
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Vercel Team** - For seamless frontend deployment
- **Railway Team** - For reliable backend hosting
- **All Contributors** - Who help improve this platform

---

<div align="center">
  <h3>🎓 Ready to Start Learning English?</h3>
  <p><strong>Visit our live platform:</strong> <a href="https://englishqnaplatform.vercel.app/">https://englishqnaplatform.vercel.app/</a></p>
  <p><em>Built with love by the English Q&A Platform community</em></p>
</div>
