# English Q&A Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication
#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional: "student", "teacher", "admin"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

### Questions
#### Get All Questions
```http
GET /questions?page=1&limit=10&category=grammar&difficulty=beginner&sort=newest&search=verb
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `difficulty` (string): beginner | intermediate | advanced
- `sort` (string): newest | oldest | votes | views
- `search` (string): Search in title and content

#### Get Single Question
```http
GET /questions/:id
```

#### Create Question
```http
POST /questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to use past tense correctly?",
  "content": "I'm confused about when to use 'was' vs 'were'...",
  "category": "grammar",
  "difficulty": "beginner",
  "tags": ["past-tense", "verb"],
  "attachments": [
    {
      "type": "image",
      "url": "https://res.cloudinary.com/...",
      "publicId": "image_id",
      "originalName": "example.jpg"
    }
  ]
}
```

#### Update Question
```http
PUT /questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  "tags": ["updated-tag"]
}
```

#### Delete Question
```http
DELETE /questions/:id
Authorization: Bearer <token>
```

### Answers
#### Get Question Answers
```http
GET /questions/:questionId/answers?page=1&limit=10&sort=oldest
```

#### Create Answer
```http
POST /questions/:questionId/answers
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "You use 'was' for singular subjects and 'were' for plural...",
  "attachments": [
    {
      "type": "audio",
      "url": "https://res.cloudinary.com/...",
      "publicId": "audio_id",
      "originalName": "pronunciation.mp3"
    }
  ]
}
```

#### Update Answer
```http
PUT /answers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated answer content"
}
```

#### Accept Answer
```http
PATCH /answers/:id/accept
Authorization: Bearer <token>
```

#### Delete Answer
```http
DELETE /answers/:id
Authorization: Bearer <token>
```

### Voting
#### Vote on Question
```http
POST /votes/questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "voteType": "up" // or "down"
}
```

#### Vote on Answer
```http
POST /votes/answers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "voteType": "up" // or "down"
}
```

### File Upload
#### Upload Single File
```http
POST /upload/single
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file_data>
folder: "questions" // optional
```

#### Upload Multiple Files
```http
POST /upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <file_data_array>
folder: "answers" // optional
```

#### Delete File
```http
DELETE /upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "publicId": "cloudinary_public_id",
  "resourceType": "image" // or "auto"
}
```

#### Get File Info
```http
GET /upload/:publicId
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## File Upload Constraints
- **Maximum file size**: 10MB
- **Supported image formats**: JPEG, PNG, GIF, WebP
- **Supported audio formats**: MP3, WAV, MP4, OGG
- **Maximum files per upload**: 5 files

## Rate Limiting
- **Window**: 15 minutes
- **Max requests**: 100 per IP address

## Environment Variables Required
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/english-qa-platform
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
