import api from './api';
import { Question, QuestionsResponse } from '../types';

export const questionService = {
  getQuestions: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    sort?: string;
    search?: string;
  }): Promise<QuestionsResponse> => {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  getQuestion: async (id: string): Promise<{ success: boolean; question: Question }> => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  createQuestion: async (data: {
    title: string;
    content: string;
    tags?: string[];
    difficultyLevels?: string[];
    categories: string[];
    attachments?: Array<{
      url: string;
      publicId: string;
      originalName: string;
      type: 'image' | 'audio';
      size?: number;
    }>;
  }): Promise<{ success: boolean; question: Question }> => {
    const response = await api.post('/questions', data);
    return response.data;
  },

  updateQuestion: async (id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
    difficultyLevels?: string[];
    categories?: string[];
    attachments?: Array<{
      url: string;
      publicId: string;
      originalName: string;
      type: 'image' | 'audio';
      size?: number;
    }>;
  }): Promise<{ success: boolean; question: Question }> => {
    const response = await api.put(`/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};
