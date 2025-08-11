# Frontend Integration Guide for Enhanced Backend

## Overview
This guide shows how to integrate the new backend features into your React frontend for file uploads, user post management, activity tracking, and saved content management.

## API Integration Examples

### 1. File Upload with Progress

```typescript
// services/uploadService.ts
export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Component usage
const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadFile(file, setUploadProgress);
      console.log('File uploaded:', result.data.url);
      // Use result.data.url in your question/answer
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,audio/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />
      {uploading && <div>Uploading: {uploadProgress}%</div>}
    </div>
  );
};
```

### 2. User Content Management

```typescript
// services/userService.ts
export const getUserQuestions = async (userId?: string, page = 1, status = 'all') => {
  const response = await fetch(`/api/users/questions/${userId || ''}?page=${page}&status=${status}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

export const deleteUserQuestion = async (questionId: string) => {
  const response = await fetch(`/api/users/questions/${questionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

// Component for user questions management
const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getUserQuestions();
        setQuestions(data.data.questions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteUserQuestion(questionId);
        setQuestions(questions.filter(q => q._id !== questionId));
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Questions</h2>
      {questions.map(question => (
        <div key={question._id} className="question-card">
          <h3>{question.title}</h3>
          <p>{question.content}</p>
          <button onClick={() => handleDelete(question._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
```

### 3. Saved Content Management

```typescript
// services/savedContentService.ts
export const saveContent = async (contentId: string, contentType: 'question' | 'answer', tags?: string[], notes?: string) => {
  const response = await fetch('/api/users/saved-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ contentId, contentType, tags, notes })
  });
  return response.json();
};

export const unsaveContent = async (contentId: string, contentType: 'question' | 'answer') => {
  const response = await fetch('/api/users/saved-content', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ contentId, contentType })
  });
  return response.json();
};

export const getSavedContent = async (type?: string, tags?: string) => {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (tags) params.append('tags', tags);

  const response = await fetch(`/api/users/saved-content?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

// Component for save/unsave functionality
const SaveButton = ({ contentId, contentType, isSaved, onToggle }) => {
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveContent(contentId, contentType);
      } else {
        await saveContent(contentId, contentType);
      }
      onToggle(!isSaved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={saving}>
      {saving ? 'Saving...' : isSaved ? '❤️ Saved' : '🤍 Save'}
    </button>
  );
};
```

### 4. Activity Tracking Display

```typescript
// services/activityService.ts
export const getUserActivity = async (userId?: string, page = 1, type?: string) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (type) params.append('type', type);

  const response = await fetch(`/api/users/activity/${userId || ''}?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

// Component for activity feed
const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getUserActivity();
        setActivities(data.data.activities);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'question_created':
        return `Created question: "${activity.metadata.title}"`;
      case 'answer_created':
        return `Answered a question`;
      case 'question_saved':
        return `Saved question: "${activity.metadata.title}"`;
      case 'file_uploaded':
        return `Uploaded a ${activity.metadata.fileType} file`;
      default:
        return `Performed ${activity.type}`;
    }
  };

  if (loading) return <div>Loading activity...</div>;

  return (
    <div>
      <h2>Recent Activity</h2>
      {activities.map(activity => (
        <div key={activity._id} className="activity-item">
          <div>{getActivityMessage(activity)}</div>
          <small>{new Date(activity.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};
```

### 5. Profile Management

```typescript
// services/profileService.ts
export const updateProfile = async (profile: any, preferences: any) => {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ profile, preferences })
  });
  return response.json();
};

// Component for profile settings
const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    socialMedia: { twitter: '', linkedin: '', github: '' }
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
    emailDigest: true
  });

  const handleSave = async () => {
    try {
      await updateProfile(profile, preferences);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      <div>
        <label>Bio:</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
        />
      </div>
      <div>
        <label>Theme:</label>
        <select
          value={preferences.theme}
          onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};
```

## Enhanced Question/Answer Components

### Question Form with File Upload

```typescript
const AskQuestionForm = () => {
  const [question, setQuestion] = useState({
    title: '',
    content: '',
    category: '',
    difficulty: 'beginner',
    tags: [],
    attachments: []
  });

  const handleFileUpload = async (file: File) => {
    try {
      const uploadResult = await uploadFile(file);
      setQuestion(prev => ({
        ...prev,
        attachments: [...prev.attachments, {
          url: uploadResult.data.url,
          type: uploadResult.data.resource_type,
          filename: file.name
        }]
      }));
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(question)
      });
      
      if (response.ok) {
        // Redirect to question page or show success
        console.log('Question created successfully!');
      }
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Question title"
        value={question.title}
        onChange={(e) => setQuestion({...question, title: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Describe your question..."
        value={question.content}
        onChange={(e) => setQuestion({...question, content: e.target.value})}
        required
      />
      
      <FileUpload onFileUpload={handleFileUpload} />
      
      {question.attachments.map((attachment, index) => (
        <div key={index} className="attachment-preview">
          <span>{attachment.filename}</span>
          <button onClick={() => {
            setQuestion(prev => ({
              ...prev,
              attachments: prev.attachments.filter((_, i) => i !== index)
            }));
          }}>Remove</button>
        </div>
      ))}
      
      <button type="submit">Post Question</button>
    </form>
  );
};
```

## State Management with Context

```typescript
// contexts/UserContext.tsx
interface UserContextType {
  user: User | null;
  savedContent: SavedContent[];
  activities: Activity[];
  refreshUserData: () => void;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const refreshUserData = async () => {
    try {
      // Fetch user data, saved content, and recent activities
      const [userData, savedData, activityData] = await Promise.all([
        fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        getSavedContent(),
        getUserActivity()
      ]);
      
      setUser(await userData.json());
      setSavedContent(savedData.data.savedContent);
      setActivities(activityData.data.activities);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, savedContent, activities, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
```

## Error Handling

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    alert('You do not have permission to perform this action');
  } else {
    alert(error.response?.data?.message || 'An error occurred');
  }
};

// Use in components
try {
  await deleteUserQuestion(questionId);
} catch (error) {
  handleApiError(error);
}
```

This integration guide provides comprehensive examples for connecting your React frontend to the enhanced backend features, enabling a rich user experience with file uploads, content management, activity tracking, and personalization.
