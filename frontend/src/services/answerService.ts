import api from './api';
import { Answer } from '../types';

export const answerService = {
  getAnswersByQuestion: async (questionId: string): Promise<{ answers: Answer[] }> => {
    const response = await api.get(`/questions/${questionId}/answers`);
    return response.data;
  },

  createAnswer: async (data: {
    questionId: string;
    content: string;
    attachments?: Array<{
      url: string;
      publicId: string;
      originalName: string;
      type: 'image' | 'audio';
      size: number;
    }>;
  }): Promise<{ success: boolean; answer: Answer }> => {
    const response = await api.post(`/questions/${data.questionId}/answers`, data);
    return response.data;
  },

  updateAnswer: async (
    id: string,
    content: string
  ): Promise<{ success: boolean; answer: Answer }> => {
    const response = await api.put(`/answers/${id}`, { content });
    return response.data;
  },

  deleteAnswer: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/answers/${id}`);
    return response.data;
  },

  acceptAnswer: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/answers/${id}/accept`);
    return response.data;
  },
};
