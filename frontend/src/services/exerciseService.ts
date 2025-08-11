import api from './api';

export interface ExerciseRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  exerciseType: 'multiple-choice' | 'fill-in-blank' | 'sentence-correction' | 'vocabulary' | 'grammar' | 'pronunciation';
  count: number;
  context?: string;
  categories?: string[];
}

export interface Exercise {
  _id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
  topic: string;
  context?: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  isPublic: boolean;
  tags: string[];
  usageCount: number;
  averageScore: number;
  totalAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSet {
  exercises: Exercise[];
  metadata: {
    topic: string;
    difficulty: string;
    exerciseType: string;
    totalCount: number;
    estimatedTime: string;
    learningObjectives: string[];
  };
}

export interface ExerciseResponse {
  success: boolean;
  message: string;
  data: {
    exercises: Exercise[];
    metadata: ExerciseSet['metadata'];
  };
}

export interface ExerciseAnswer {
  answer: string;
  timeSpent?: number;
}

export interface ExerciseAnswerResponse {
  success: boolean;
  data: {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    score: number;
  };
}

export interface ExercisesListResponse {
  success: boolean;
  data: {
    exercises: Exercise[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

export interface ExerciseFilters {
  type?: string;
  difficulty?: string;
  category?: string;
  topic?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'popular' | 'difficulty';
  page?: number;
  limit?: number;
}

// Generate exercises based on user request
export const generateExercises = async (request: ExerciseRequest): Promise<ExerciseResponse> => {
  try {
    const response = await api.post('/exercises/generate', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate exercises');
  }
};

// Generate exercises from existing content
export const generateExercisesFromContent = async (
  content: string,
  request: Partial<ExerciseRequest>
): Promise<ExerciseResponse> => {
  try {
    const response = await api.post('/exercises/generate-from-content', {
      content,
      ...request
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate exercises from content');
  }
};

// Generate personalized exercises
export const generatePersonalizedExercises = async (
  request: Partial<ExerciseRequest>
): Promise<ExerciseResponse> => {
  try {
    const response = await api.post('/exercises/generate-personalized', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate personalized exercises');
  }
};

// Get all exercises with filters
export const getExercises = async (filters: ExerciseFilters = {}): Promise<ExercisesListResponse> => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/exercises?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get exercises');
  }
};

// Get a specific exercise
export const getExercise = async (id: string): Promise<{ success: boolean; data: Exercise }> => {
  try {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get exercise');
  }
};

// Get user's exercises
export const getUserExercises = async (
  userId?: string,
  page = 1,
  limit = 10
): Promise<ExercisesListResponse> => {
  try {
    const url = userId ? `/exercises/user/${userId}` : '/exercises/user';
    const response = await api.get(`${url}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user exercises');
  }
};

// Submit answer to an exercise
export const submitExerciseAnswer = async (
  exerciseId: string,
  answer: ExerciseAnswer
): Promise<ExerciseAnswerResponse> => {
  try {
    const response = await api.post(`/exercises/${exerciseId}/submit`, answer);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit answer');
  }
};

// Update exercise (admin/teacher only)
export const updateExercise = async (
  exerciseId: string,
  updateData: Partial<Exercise>
): Promise<{ success: boolean; message: string; data: Exercise }> => {
  try {
    const response = await api.put(`/exercises/${exerciseId}`, updateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update exercise');
  }
};

// Delete exercise (admin/teacher only)
export const deleteExercise = async (exerciseId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/exercises/${exerciseId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete exercise');
  }
};

// Helper function to get exercise type display name
export const getExerciseTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'multiple-choice': 'Multiple Choice',
    'fill-in-blank': 'Fill in the Blank',
    'sentence-correction': 'Sentence Correction',
    'vocabulary': 'Vocabulary',
    'grammar': 'Grammar',
    'pronunciation': 'Pronunciation'
  };
  return typeMap[type] || type;
};

// Helper function to get difficulty color
export const getDifficultyColor = (difficulty: string): string => {
  const colorMap: Record<string, string> = {
    'beginner': 'text-green-600 bg-green-100',
    'intermediate': 'text-yellow-600 bg-yellow-100',
    'advanced': 'text-orange-600 bg-orange-100',
    'expert': 'text-red-600 bg-red-100'
  };
  return colorMap[difficulty] || 'text-gray-600 bg-gray-100';
};

// Helper function to get category color
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'grammar': 'text-blue-600 bg-blue-100',
    'vocabulary': 'text-purple-600 bg-purple-100',
    'pronunciation': 'text-pink-600 bg-pink-100',
    'writing': 'text-indigo-600 bg-indigo-100',
    'speaking': 'text-orange-600 bg-orange-100',
    'reading': 'text-green-600 bg-green-100',
    'listening': 'text-teal-600 bg-teal-100',
    'business': 'text-gray-600 bg-gray-100',
    'academic': 'text-red-600 bg-red-100',
    'casual': 'text-yellow-600 bg-yellow-100',
    'technical': 'text-blue-600 bg-blue-100',
    'other': 'text-gray-600 bg-gray-100'
  };
  return colorMap[category] || 'text-gray-600 bg-gray-100';
};
