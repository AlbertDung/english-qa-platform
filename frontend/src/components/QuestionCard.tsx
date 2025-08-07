import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      grammar: 'bg-blue-100 text-blue-800',
      vocabulary: 'bg-purple-100 text-purple-800',
      pronunciation: 'bg-pink-100 text-pink-800',
      writing: 'bg-indigo-100 text-indigo-800',
      speaking: 'bg-orange-100 text-orange-800',
      reading: 'bg-green-100 text-green-800',
      listening: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
              {question.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            {question.acceptedAnswer && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ✓ Answered
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600">
            <Link to={`/questions/${question._id}`}>
              {question.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {question.content.substring(0, 150)}...
          </p>
          
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>{question.votes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{question.answers.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{question.viewCount}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {question.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-primary-600 font-medium">
                {question.author.username}
              </span>
              <span>•</span>
              <span>{formatTimeAgo(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
