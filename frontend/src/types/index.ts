export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  reputation: number;
  avatar?: string;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
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
