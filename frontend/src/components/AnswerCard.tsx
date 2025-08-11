import React from 'react';
import { Answer } from '../types';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CheckCircleIcon,
  PaperClipIcon,
  PhotoIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

interface AnswerCardProps {
  answer: Answer;
  onVote: (type: 'up' | 'down') => void;
  onAccept?: () => void;
  canAccept?: boolean;
  isAccepted?: boolean;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ 
  answer, 
  onVote, 
  onAccept, 
  canAccept, 
  isAccepted 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start space-x-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => onVote('up')}
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold text-gray-900">{answer.votes}</span>
          <button
            onClick={() => onVote('down')}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowDownIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Answer Content */}
        <div className="flex-1">
          <div className="prose max-w-none mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
          </div>

          {/* Answer Attachments */}
          {answer.attachments && answer.attachments.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <PaperClipIcon className="w-4 h-4 mr-2 text-gray-500" />
                Attachments ({answer.attachments.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {answer.attachments.map((attachment, index) => (
                  <div key={index} className="group bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {attachment.type === 'image' ? (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-5 h-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MusicalNoteIcon className="w-5 h-5 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {attachment.originalName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {attachment.type === 'image' ? 'Image file' : 'Audio file'}
                        </p>
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 hover:scale-105 transform"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span>Answered by </span>
              <span className="font-medium text-gray-700 ml-1">{answer.author.username}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(answer.createdAt)}</span>
            </div>
            
            {/* Accept Answer Button */}
            {canAccept && !isAccepted && (
              <button
                onClick={onAccept}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200 hover:scale-105 transform"
              >
                Accept Answer
              </button>
            )}
            
            {/* Accepted Badge */}
            {isAccepted && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-full">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Accepted</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
