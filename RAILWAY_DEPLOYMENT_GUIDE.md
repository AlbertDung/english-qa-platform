# Railway Backend Deployment Guide

## Prerequisites
- GitHub repository with your backend code
- Railway account (free tier available)
- MongoDB Atlas database (or other MongoDB instance)

## Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Complete the verification process

## Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the `backend` folder as the root directory

## Step 3: Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/english-qa?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Optional Variables (if using these services):
```
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Step 4: Deploy
1. Railway will automatically detect your Node.js app
2. It will run `npm install` and `npm run build`
3. Then start with `npm start`
4. Your API will be available at the provided Railway URL

## Step 5: Update Frontend Configuration
Once deployed, update your frontend's API configuration to use the Railway URL instead of localhost.

## Step 6: Test Your API
Test the health endpoint: `https://your-railway-url.railway.app/api/health`

## Troubleshooting
- Check Railway logs for build errors
- Ensure all environment variables are set
- Verify MongoDB connection string is correct
- Check if your database allows external connections

## Cost
- Railway free tier: $5 credit monthly
- Pay-as-you-use after that
- Very cost-effective for small to medium projects
