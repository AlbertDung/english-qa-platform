import api from './api';

export const voteService = {
  vote: async (data: {
    targetType: 'question' | 'answer';
    targetId: string;
    voteType: 'up' | 'down';
  }): Promise<{ success: boolean; votes: number }> => {
    const endpoint = data.targetType === 'question' 
      ? `/votes/questions/${data.targetId}` 
      : `/votes/answers/${data.targetId}`;
    const response = await api.post(endpoint, { voteType: data.voteType });
    return response.data;
  },

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
