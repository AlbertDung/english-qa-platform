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
    emailNotifications: boolean;
    categories: string[];
    difficultyLevel: string;
  };
  profile: {
    bio?: string;
    location?: string;
    website?: string;
    learningGoals?: string[];
    nativeLanguage?: string;
    englishLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  votes: number;
  viewCount: number;
  answers: Answer[];
  acceptedAnswer?: string;
  categories: string[]; // Changed from single category to array
  difficultyLevels: string[]; // Changed from single difficulty to array
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
  type: 'image' | 'audio';
  url: string;
  publicId: string;
  originalName: string;
}

export interface Activity {
  _id: string;
  user: string;
  type: 'question_created' | 'answer_created' | 'question_edited' | 'answer_edited' | 'question_deleted' | 'answer_deleted' | 
        'vote_cast' | 'question_saved' | 'answer_saved' | 'question_unsaved' | 'answer_unsaved';
  targetId: string;
  targetType: 'question' | 'answer' | 'vote';
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
