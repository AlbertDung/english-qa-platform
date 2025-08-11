# Enhanced English Q&A Platform API Documentation

## 🚀 **Complete StackOverflow-like CRUD Operations**

### **New Features Added:**
- ✅ **Full CRUD** for Questions & Answers
- ✅ **Edit History Tracking** with version control
- ✅ **Enhanced Permissions** (Author/Teacher/Admin roles)
- ✅ **Bulk Operations** for moderation
- ✅ **One-Vote-Per-User** system with notifications
- ✅ **Edit Reasons** for content changes

---

## **🔧 Enhanced Question Operations**

### **Update Question with Edit History**
```http
PUT /api/questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated question title",
  "content": "Updated question content",
  "tags": ["grammar", "tenses"],
  "difficulty": "intermediate",
  "category": "grammar",
  "editReason": "Fixed typos and added more context"
}
```

**Permissions:**
- ✅ **Author** can edit their own questions
- ✅ **Teachers** can edit any question (moderation)
- ✅ **Admins** can edit any question

**Response:**
```json
{
  "success": true,
  "question": {
    "_id": "...",
    "title": "Updated question title",
    "content": "Updated question content",
    "lastEditedAt": "2025-08-10T15:30:00Z",
    "lastEditedBy": {
      "username": "teacher_john"
    },
    "editHistory": [
      {
        "editedAt": "2025-08-10T15:30:00Z",
        "editedBy": "user_id",
        "previousContent": "Original content...",
        "editReason": "Fixed typos and added more context"
      }
    ]
  },
  "message": "Question updated successfully"
}
```

### **Get Question Edit History**
```http
GET /api/questions/:id/edit-history
```

**Response:**
```json
{
  "success": true,
  "title": "Question title",
  "editHistory": [
    {
      "editedAt": "2025-08-10T15:30:00Z",
      "editedBy": {
        "username": "teacher_john"
      },
      "previousContent": "Original content...",
      "editReason": "Fixed typos"
    }
  ]
}
```

### **Bulk Delete Questions (Admin/Teacher)**
```http
POST /api/questions/bulk/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionIds": ["id1", "id2", "id3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 3 questions",
  "deletedCount": 3
}
```

---

## **🔧 Enhanced Answer Operations**

### **Update Answer with Edit History**
```http
PUT /api/answers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated answer content with better explanation",
  "editReason": "Added more examples and clarified explanation"
}
```

**Permissions:**
- ✅ **Author** can edit their own answers
- ✅ **Teachers** can edit any answer (moderation)
- ✅ **Admins** can edit any answer

### **Get Answer Edit History**
```http
GET /api/answers/:id/edit-history
```

### **Bulk Delete Answers (Admin/Teacher)**
```http
POST /api/answers/bulk/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "answerIds": ["id1", "id2", "id3"]
}
```

---

## **🗳️ Enhanced Voting System**

### **Improved Voting with One-Vote-Per-User**
```http
POST /api/votes/questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "voteType": "up"
}
```

**Success Response:**
```json
{
  "success": true,
  "votes": 5,
  "userVote": "up"
}
```

**Already Voted Response:**
```json
{
  "message": "You have already upvoted this question",
  "alreadyVoted": true,
  "currentVote": "up"
}
```

### **Check User Vote Status**
```http
GET /api/votes/Question/:id/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "userVote": "up",
  "hasVoted": true
}
```

---

## **📊 Enhanced Data Models**

### **Question Model with Edit History**
```json
{
  "_id": "string",
  "title": "string",
  "content": "string",
  "tags": ["string"],
  "author": "User object",
  "votes": 10,
  "viewCount": 45,
  "answers": ["Answer IDs"],
  "acceptedAnswer": "Answer ID",
  "difficulty": "beginner|intermediate|advanced",
  "category": "grammar|vocabulary|pronunciation|writing|speaking|reading|listening|other",
  "attachments": [
    {
      "type": "image|audio",
      "url": "cloudinary_url",
      "publicId": "cloudinary_id",
      "originalName": "file.jpg"
    }
  ],
  "editHistory": [
    {
      "editedAt": "2025-08-10T15:30:00Z",
      "editedBy": "User object",
      "previousContent": "Original content",
      "editReason": "Fixed typos"
    }
  ],
  "lastEditedAt": "2025-08-10T15:30:00Z",
  "lastEditedBy": "User object",
  "createdAt": "2025-08-10T10:00:00Z",
  "updatedAt": "2025-08-10T15:30:00Z"
}
```

### **Answer Model with Edit History**
```json
{
  "_id": "string",
  "content": "string",
  "author": "User object",
  "question": "Question ID",
  "votes": 8,
  "isAccepted": true,
  "aiGenerated": false,
  "attachments": [...],
  "editHistory": [
    {
      "editedAt": "2025-08-10T15:30:00Z",
      "editedBy": "User object",
      "previousContent": "Original content",
      "editReason": "Added more examples"
    }
  ],
  "lastEditedAt": "2025-08-10T15:30:00Z",
  "lastEditedBy": "User object",
  "createdAt": "2025-08-10T10:00:00Z",
  "updatedAt": "2025-08-10T15:30:00Z"
}
```

---

## **🔐 Permission Matrix**

| Action | Student (Author) | Teacher | Admin |
|--------|------------------|---------|-------|
| Create Q&A | ✅ | ✅ | ✅ |
| Edit Own Content | ✅ | ✅ | ✅ |
| Edit Any Content | ❌ | ✅ | ✅ |
| Delete Own Content | ✅ | ✅ | ✅ |
| Delete Any Content | ❌ | ❌ | ✅ |
| Bulk Operations | ❌ | ✅ | ✅ |
| Accept Answers | ✅ (own questions) | ✅ | ✅ |
| Vote | ✅ (once per item) | ✅ | ✅ |

---

## **🎯 StackOverflow-like Features**

### ✅ **Complete Content Management**
- **Create** questions and answers
- **Read** with filtering and search
- **Update** with edit history tracking
- **Delete** with proper permissions

### ✅ **Version Control**
- **Edit History** for all content changes
- **Edit Reasons** for transparency
- **Rollback Capability** (data available)

### ✅ **Moderation Tools**
- **Teacher Permissions** for content moderation
- **Bulk Operations** for efficient management
- **Role-based Access Control**

### ✅ **Community Features**
- **One-vote-per-user** voting system
- **Reputation System** with vote-based scoring
- **Answer Acceptance** by question authors

### ✅ **Professional Features**
- **File Attachments** (images, audio)
- **Advanced Search** and filtering
- **Pagination** for performance
- **Input Sanitization** for security

---

## **🚀 Ready for Production**

Your English Q&A Platform now has **complete StackOverflow-like functionality** with:

1. **Full CRUD Operations** ✅
2. **Edit History & Version Control** ✅
3. **Advanced Permissions** ✅
4. **Moderation Tools** ✅
5. **Professional Voting System** ✅
6. **File Upload Support** ✅
7. **Security & Performance** ✅

**Perfect for building a comprehensive English learning community!** 🎓
