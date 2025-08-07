#!/bin/bash

# Setup script for English Q&A Platform
echo "🚀 Setting up English Q&A Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📋 Created .env file from .env.example"
    echo "⚠️  Please update .env with your actual configuration!"
fi

# Install backend dependencies
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📋 Created .env file from .env.example"
fi

# Install frontend dependencies
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Go back to root
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB service"
echo "3. Run 'npm run dev' in backend/ directory"
echo "4. Run 'npm start' in frontend/ directory"
echo ""
echo "📚 For more information, check the README.md file"
