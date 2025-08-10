import api from './api';

export interface VoteResponse {
  success: boolean;
  votes: number;
  userVote?: 'up' | 'down';
  message?: string;
  alreadyVoted?: boolean;
  currentVote?: 'up' | 'down';
}

export interface VoteStatusResponse {
  success: boolean;
  userVote: 'up' | 'down' | null;
  hasVoted: boolean;
}

export const voteService = {
  vote: async (data: {
    targetType: 'question' | 'answer';
    targetId: string;
    voteType: 'up' | 'down';
  }): Promise<VoteResponse> => {
    try {
      const endpoint = data.targetType === 'question' 
        ? `/votes/questions/${data.targetId}` 
        : `/votes/answers/${data.targetId}`;
      const response = await api.post(endpoint, { voteType: data.voteType });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return error.response.data;
      }
      throw error;
    }
  },

  voteQuestion: async (
    id: string,
    voteType: 'up' | 'down'
  ): Promise<VoteResponse> => {
    try {
      const response = await api.post(`/votes/questions/${id}`, { voteType });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return error.response.data;
      }
      throw error;
    }
  },

  voteAnswer: async (
    id: string,
    voteType: 'up' | 'down'
  ): Promise<VoteResponse> => {
    try {
      const response = await api.post(`/votes/answers/${id}`, { voteType });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return error.response.data;
      }
      throw error;
    }
  },

  getUserVoteStatus: async (
    targetType: 'Question' | 'Answer',
    targetId: string
  ): Promise<VoteStatusResponse> => {
    const response = await api.get(`/votes/${targetType}/${targetId}/status`);
    return response.data;
  }
};
