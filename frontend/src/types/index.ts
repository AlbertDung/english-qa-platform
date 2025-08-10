export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  reputation: number;
  avatar?: string;
  createdAt: string;
  savedQuestions: string[];
  savedAnswers: string[];
  activityLog: string[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
    emailDigest: boolean;
  };
  profile: {
    bio: string;
    location: string;
    website: string;
    socialMedia: {
      twitter: string;
      linkedin: string;
      github: string;
    };
  };
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  votes: number;
  views: number;
  viewCount: number;
  answers: Answer[];
  acceptedAnswer?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'writing' | 'speaking' | 'reading' | 'listening' | 'other';
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  _id: string;
  content: string;
  author: User;
  question: string;
  votes: number;
  isAccepted: boolean;
  aiGenerated: boolean;
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  publicId: string;
  fileType: 'image' | 'audio';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Activity {
  _id: string;
  user: string;
  type: 'question_created' | 'question_updated' | 'question_deleted' | 'answer_created' | 'answer_updated' | 'answer_deleted' | 
        'question_voted' | 'answer_voted' | 'question_saved' | 'answer_saved' | 'question_unsaved' | 'answer_unsaved' | 
        'file_uploaded' | 'profile_updated';
  targetId: string;
  targetType: 'question' | 'answer' | 'user';
  metadata: Record<string, any>;
  createdAt: string;
}

export interface SavedContent {
  _id: string;
  user: string;
  contentId: string;
  contentType: 'question' | 'answer';
  tags: string[];
  notes: string;
  savedAt: string;
  populatedContent?: Question | Answer;
}

export interface Vote {
  _id: string;
  user: string;
  target: string;
  targetType: 'Question' | 'Answer';
  voteType: 'up' | 'down';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
}

export interface QuestionsResponse {
  success: boolean;
  questions: Question[];
  pagination: PaginationInfo;
}
