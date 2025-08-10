import React, { useState, useEffect } from 'react';
import { getSavedContent, unsaveContent } from '../services/userService';
import { SavedContent, Question, Answer } from '../types';

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
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Saved Content
        </h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All ({pagination?.totalItems || 0})
            </button>
            <button
              onClick={() => setFilter('question')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'question'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setFilter('answer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'answer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {savedItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No saved content yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Type Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isQuestion 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            }`}>
              {isQuestion ? '❓ Question' : '💡 Answer'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Saved {new Date(item.savedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title for questions */}
          {isQuestion && (content as Question).title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {(content as Question).title}
            </h3>
          )}

          {/* Content preview */}
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
            {content?.content || 'Content not available'}
          </p>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 mb-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <span className="font-medium">Note:</span> {item.notes}
              </p>
            </div>
          )}

          {/* Author info */}
          {content?.author && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Remove from saved"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
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
