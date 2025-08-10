import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from '../types';
import { 
  ChatBubbleLeftIcon, 
  EyeIcon, 
  ArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MusicalNoteIcon,
  LanguageIcon,
  BeakerIcon,
  AdjustmentsVerticalIcon,
  FireIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

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

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          border: 'border-success-200',
          icon: BeakerIcon
        };
      case 'intermediate':
        return {
          bg: 'bg-warning-50',
          text: 'text-warning-700',
          border: 'border-warning-200',
          icon: AdjustmentsVerticalIcon
        };
      case 'advanced':
        return {
          bg: 'bg-error-50',
          text: 'text-error-700',
          border: 'border-error-200',
          icon: FireIcon
        };
      default:
        return {
          bg: 'bg-neutral-50',
          text: 'text-neutral-700',
          border: 'border-neutral-200',
          icon: BookOpenIcon
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    const configs: { [key: string]: { bg: string; text: string; border: string; icon: any } } = {
      grammar: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200', icon: PencilIcon },
      vocabulary: { bg: 'bg-secondary-50', text: 'text-secondary-700', border: 'border-secondary-200', icon: DocumentTextIcon },
      pronunciation: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: SpeakerWaveIcon },
      writing: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: PencilIcon },
      speaking: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: ChatBubbleOvalLeftEllipsisIcon },
      reading: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: BookOpenIcon },
      listening: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: MusicalNoteIcon },
      other: { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200', icon: LanguageIcon }
    };
    return configs[category.toLowerCase()] || configs.other;
  };

  const difficultyConfig = getDifficultyConfig(question.difficulty);
  const categoryConfig = getCategoryConfig(question.category);
  const hasAcceptedAnswer = question.acceptedAnswer;
  const isHot = question.viewCount > 100 || question.votes > 5;

  return (
    <article className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-primary-200 hover:shadow-medium transition-all duration-300 animate-fade-in">
      {/* Header with badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border ${categoryConfig.bg} ${categoryConfig.text} ${categoryConfig.border}`}>
            <categoryConfig.icon className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{question.category}</span>
          </div>
          
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border}`}>
            <difficultyConfig.icon className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{question.difficulty}</span>
          </div>

          {hasAcceptedAnswer && (
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-success-50 text-success-700 border border-success-200">
              <CheckCircleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Solved</span>
            </div>
          )}

          {isHot && (
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
              <FireIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Hot</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-neutral-400">
          <ClockIcon className="w-4 h-4" />
          <span className="text-sm">{formatTimeAgo(question.createdAt)}</span>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
        <Link to={`/questions/${question._id}`} className="block">
          {question.title}
        </Link>
      </h3>

      {/* Question Preview */}
      <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
        {question.content.length > 200 
          ? `${question.content.substring(0, 200)}...` 
          : question.content
        }
      </p>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
          {question.tags.length > 4 && (
            <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-sm">
              +{question.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer with stats and author */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        {/* Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-neutral-500">
            <div className={`p-1.5 rounded-lg ${question.votes > 0 ? 'bg-success-50 text-success-600' : 'bg-neutral-50'}`}>
              <ArrowUpIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{question.votes}</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-500">
            <div className={`p-1.5 rounded-lg ${question.answers.length > 0 ? 'bg-primary-50 text-primary-600' : 'bg-neutral-50'}`}>
              <ChatBubbleLeftIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{question.answers.length}</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-500">
            <div className="p-1.5 rounded-lg bg-neutral-50">
              <EyeIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{question.viewCount}</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {question.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-800">
              {question.author.username}
            </p>
            <p className="text-xs text-neutral-500">
              {question.author.reputation || 0} reputation
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default QuestionCard;
