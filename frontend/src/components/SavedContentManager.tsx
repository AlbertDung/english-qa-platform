import React, { useState, useEffect } from 'react';
import { getSavedContent, unsaveContent } from '../services/userService';
import { SavedContent, Question, Answer } from '../types';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface SavedContentManagerProps {
  className?: string;
}

export const SavedContentManager: React.FC<SavedContentManagerProps> = ({ className = "" }) => {
  const [savedItems, setSavedItems] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'question' | 'answer'>('all');
  const [searchTags, setSearchTags] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const fetchSavedContent = React.useCallback(async (newPage = 1) => {
    setLoading(true);
    try {
      const typeFilter = filter === 'all' ? undefined : filter;
      const response = await getSavedContent(typeFilter, newPage, 10, searchTags || undefined);
      
      if (newPage === 1) {
        setSavedItems(response.data.savedContent);
      } else {
        setSavedItems(prev => [...prev, ...response.data.savedContent]);
      }
      
      setPagination(response.data.pagination);
      setPage(newPage);
    } catch (error) {
      console.error('Failed to fetch saved content:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTags]);

  useEffect(() => {
    fetchSavedContent(1);
  }, [fetchSavedContent]);

  const handleUnsave = async (contentId: string, contentType: 'question' | 'answer') => {
    try {
      await unsaveContent(contentId, contentType);
      setSavedItems(prev => prev.filter(item => !(item.contentId === contentId && item.contentType === contentType)));
    } catch (error) {
      console.error('Failed to unsave content:', error);
    }
  };

  if (loading && page === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 rounded-xl mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Saved Content
        </h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All ({pagination?.totalItems || 0})
            </button>
            <button
              onClick={() => setFilter('question')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'question'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setFilter('answer')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'answer'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Answers
            </button>
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by tags..."
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {savedItems.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No saved content yet
          </h3>
          <p className="text-neutral-500">
            Start saving questions and answers to build your personal collection
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <SavedItemCard
              key={`${item.contentType}-${item.contentId}`}
              item={item}
              onUnsave={handleUnsave}
            />
          ))}
          
          {/* Load More */}
          {pagination && pagination.hasNext && (
            <div className="text-center">
              <button
                onClick={() => fetchSavedContent(page + 1)}
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface SavedItemCardProps {
  item: SavedContent;
  onUnsave: (contentId: string, contentType: 'question' | 'answer') => void;
}

const SavedItemCard: React.FC<SavedItemCardProps> = ({ item, onUnsave }) => {
  const content = item.populatedContent as Question | Answer;
  const isQuestion = item.contentType === 'question';
  
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Type Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isQuestion 
                ? 'bg-primary-100 text-primary-800'
                : 'bg-success-100 text-success-800'
            }`}>
              {isQuestion ? (
                <>
                  <ChatBubbleLeftRightIcon className="w-3 h-3" />
                  <span>Question</span>
                </>
              ) : (
                <>
                  <LightBulbIcon className="w-3 h-3" />
                  <span>Answer</span>
                </>
              )}
            </span>
            <span className="text-xs text-neutral-500">
              Saved {new Date(item.savedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title for questions */}
          {isQuestion && (content as Question).title && (
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {(content as Question).title}
            </h3>
          )}

          {/* Content preview */}
          <p className="text-neutral-600 mb-3 line-clamp-3">
            {content?.content || 'Content not available'}
          </p>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary-100 text-secondary-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="bg-warning-50 border-l-4 border-warning-400 p-3 mb-3">
              <p className="text-sm text-warning-800">
                <span className="font-medium">Note:</span> {item.notes}
              </p>
            </div>
          )}

          {/* Author info */}
          {content?.author && (
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <span>by</span>
              <span className="font-medium">{content.author.username}</span>
              <span>•</span>
              <span>{content.author.reputation} reputation</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onUnsave(item.contentId, item.contentType)}
            className="p-2 text-error-400 hover:text-error-600 hover:bg-error-50 rounded-xl transition-colors"
            title="Remove from saved"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
            title="View content"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
