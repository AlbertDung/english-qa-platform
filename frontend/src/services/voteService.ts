import api from './api';

export const voteService = {
  voteQuestion: async (
    id: string,
    voteType: 'up' | 'down'
  ): Promise<{ success: boolean; votes: number }> => {
    const response = await api.post(`/votes/questions/${id}`, { voteType });
    return response.data;
  },

  voteAnswer: async (
    id: string,
    voteType: 'up' | 'down'
  ): Promise<{ success: boolean; votes: number }> => {
    const response = await api.post(`/votes/answers/${id}`, { voteType });
    return response.data;
  },
};
