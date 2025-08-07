import React, { useState } from 'react';
import { Answer } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { voteService } from '../services/voteService';
import { answerService } from '../services/answerService';

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId: string;
  onUpdate: () => void;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ 
  answer, 
  questionAuthorId, 
  onUpdate 
}) => {
  const { state } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState(answer.votes);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m ago`;
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!state.isAuthenticated || isVoting) return;

    setIsVoting(true);
    try {
      const response = await voteService.voteAnswer(answer._id, voteType);
      setVotes(response.votes);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAcceptAnswer = async () => {
    if (!state.isAuthenticated) return;

    try {
      await answerService.acceptAnswer(answer._id);
      onUpdate();
    } catch (error) {
      console.error('Error accepting answer:', error);
    }
  };

  const canAcceptAnswer = state.user?.id === questionAuthorId && !answer.isAccepted;

  return (
    <div className={`bg-white border rounded-lg p-6 ${answer.isAccepted ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
      {answer.isAccepted && (
        <div className="flex items-center space-x-2 mb-4 text-green-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Accepted Answer</span>
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => handleVote('up')}
            disabled={!state.isAuthenticated || isVoting}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
          
          <span className="text-lg font-semibold text-gray-800">{votes}</span>
          
          <button
            onClick={() => handleVote('down')}
            disabled={!state.isAuthenticated || isVoting}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </button>

          {canAcceptAnswer && (
            <button
              onClick={handleAcceptAnswer}
              className="p-1 rounded-full hover:bg-green-100 text-green-600"
              title="Accept this answer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1">
          <div className="prose max-w-none mb-4">
            <div className="whitespace-pre-wrap">{answer.content}</div>
          </div>

          {answer.aiGenerated && (
            <div className="flex items-center space-x-2 mb-4 text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">AI-generated answer</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {answer.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-primary-600 font-medium">
                {answer.author.username}
              </span>
              <span className="text-gray-400">
                ({answer.author.reputation} reputation)
              </span>
              <span>•</span>
              <span>{formatTimeAgo(answer.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
