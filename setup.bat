@echo off
echo 🚀 Setting up English Q&A Platform...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

:: Setup Backend
echo 📦 Setting up backend...
cd backend

:: Copy environment file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo 📋 Created .env file from .env.example
    echo ⚠️  Please update .env with your actual configuration!
)

:: Install backend dependencies
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

:: Setup Frontend
echo 📦 Setting up frontend...
cd ..\frontend

:: Copy environment file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo 📋 Created .env file from .env.example
)

:: Install frontend dependencies
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

:: Go back to root
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📝 Next steps:
echo 1. Update backend/.env with your MongoDB URI and JWT secret
echo 2. Start MongoDB service
echo 3. Run 'npm run dev' in backend/ directory
echo 4. Run 'npm start' in frontend/ directory
echo.
echo 📚 For more information, check the README.md file
pause
