import api from './api';
import { Answer } from '../types';

export const answerService = {
  createAnswer: async (
    questionId: string,
    content: string
  ): Promise<{ success: boolean; answer: Answer }> => {
    const response = await api.post(`/answers/questions/${questionId}/answers`, { content });
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
