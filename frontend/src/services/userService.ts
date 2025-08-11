import api from './api';
import { ApiResponse, SavedContent, User } from '../types';

// User Questions
export const getUserQuestions = async (
  userId?: string, 
  page = 1, 
  limit = 1000, 
  status: 'all' | 'answered' | 'unanswered' = 'all'
) => {
  const endpoint = userId ? `/users/questions/${userId}` : '/users/questions';
  const response = await api.get(`${endpoint}?page=${page}&limit=${limit}&status=${status}`);
  return response.data;
};

// User Answers
export const getUserAnswers = async (
  userId?: string, 
  page = 1, 
  limit = 10, 
  status: 'all' | 'accepted' = 'all'
) => {
  const endpoint = userId ? `/users/answers/${userId}` : '/users/answers';
  const response = await api.get(`${endpoint}?page=${page}&limit=${limit}&status=${status}`);
  return response.data;
};

// Delete User Content
export const deleteUserQuestion = async (questionId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/users/questions/${questionId}`);
  return response.data;
};

export const deleteUserAnswer = async (answerId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/users/answers/${answerId}`);
  return response.data;
};

// Saved Content Management
export const saveContent = async (
  contentId: string, 
  contentType: 'question' | 'answer', 
  tags: string[] = [], 
  notes = ''
): Promise<ApiResponse<SavedContent>> => {
  const response = await api.post('/users/saved-content', {
    contentId,
    contentType,
    tags,
    notes
  });
  return response.data;
};

export const unsaveContent = async (
  contentId: string, 
  contentType: 'question' | 'answer'
): Promise<ApiResponse<null>> => {
  const response = await api.delete('/users/saved-content', {
    data: { contentId, contentType }
  });
  return response.data;
};

export const getSavedContent = async (
  type?: 'question' | 'answer',
  page = 1,
  limit = 10,
  tags?: string
) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (type) params.append('type', type);
  if (tags) params.append('tags', tags);

  const response = await api.get(`/users/saved-content?${params}`);
  return response.data;
};

// Activity Management
export const getUserActivity = async (
  userId?: string,
  page = 1,
  limit = 20,
  type?: string
) => {
  const endpoint = userId ? `/users/activity/${userId}` : '/users/activity';
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (type) params.append('type', type);

  const response = await api.get(`${endpoint}?${params}`);
  return response.data;
};

// Profile Management
export const updateUserProfile = async (
  profile: Partial<User['profile']>,
  preferences: Partial<User['preferences']>
): Promise<ApiResponse<User>> => {
  const response = await api.put('/users/profile', {
    profile,
    preferences
  });
  return response.data;
};

// Check if content is saved
export const isContentSaved = async (
  contentId: string,
  contentType: 'question' | 'answer'
): Promise<boolean> => {
  try {
    const response = await getSavedContent(contentType, 1, 1);
    return response.data.savedContent.some((item: SavedContent) => 
      item.contentId === contentId && item.contentType === contentType
    );
  } catch (error) {
    console.error('Error checking saved status:', error);
    return false;
  }
};

// Get user statistics
export interface UserStats {
  questionsCount: number;
  answersCount: number;
  acceptedAnswersCount: number;
  totalVotes: number;
  savedItemsCount: number;
  recentActivities: number;
}

export const getUserStats = async (userId?: string): Promise<UserStats> => {
  try {
    const [questionsData, answersData, savedData, activityData] = await Promise.all([
      getUserQuestions(userId, 1, 1),
      getUserAnswers(userId, 1, 1),
      getSavedContent(undefined, 1, 1),
      getUserActivity(userId, 1, 1)
    ]);

    return {
      questionsCount: questionsData.data.pagination.totalQuestions || 0,
      answersCount: answersData.data.pagination.totalAnswers || 0,
      acceptedAnswersCount: 0, // Would need separate endpoint
      totalVotes: 0, // Would need separate endpoint
      savedItemsCount: savedData.data.pagination.totalItems || 0,
      recentActivities: activityData.data.pagination.totalActivities || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      questionsCount: 0,
      answersCount: 0,
      acceptedAnswersCount: 0,
      totalVotes: 0,
      savedItemsCount: 0,
      recentActivities: 0
    };
  }
};
