import React, { useState } from 'react';
import { Answer } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AnswerCardProps {
  answer: Answer;
  onVote: (type: 'up' | 'down') => Promise<void>;
  onAccept: () => Promise<void>;
  canAccept: boolean;
  isAccepted: boolean;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ 
  answer, 
  onVote,
  onAccept,
  canAccept,
  isAccepted
}) => {
  const { isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!isAuthenticated || isVoting) return;

    try {
      setIsVoting(true);
      await onVote(type);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAccept = async () => {
    if (!isAuthenticated) return;

    try {
      await onAccept();
    } catch (error) {
      console.error('Accept failed:', error);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isAccepted ? 'border-2 border-green-500' : ''}`}>
      {isAccepted && (
        <div className="mb-4 flex items-center text-green-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Accepted Answer</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="prose max-w-none mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <span>Answered by </span>
              <span className="font-medium text-gray-700 ml-1">{answer.author.username}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(answer.createdAt)}</span>
            </div>
            
            {canAccept && (
              <button
                onClick={handleAccept}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Accept Answer
              </button>
            )}
          </div>
        </div>

        {/* Voting Section */}
        <div className="flex flex-col items-center ml-4">
          <button
            onClick={() => handleVote('up')}
            disabled={!isAuthenticated || isVoting}
            className="p-2 text-gray-400 hover:text-green-500 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-lg font-bold text-gray-900">{answer.votes}</span>
          <button
            onClick={() => handleVote('down')}
            disabled={!isAuthenticated || isVoting}
            className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
