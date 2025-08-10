import React, { useState, useEffect } from 'react';
import { getUserActivity } from '../services/userService';
import { Activity } from '../types';

interface ActivityFeedProps {
  userId?: string;
  limit?: number;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  userId,
  limit = 20,
  className = ""
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const fetchActivities = React.useCallback(async (newPage = 1, activityType?: string) => {
    setLoading(true);
    try {
      const response = await getUserActivity(
        userId, 
        newPage, 
        limit, 
        activityType === 'all' ? undefined : activityType
      );
      
      if (newPage === 1) {
        setActivities(response.data.activities);
      } else {
        setActivities(prev => [...prev, ...response.data.activities]);
      }
      
      setPagination(response.data.pagination);
      setPage(newPage);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchActivities(1, filter);
  }, [fetchActivities, filter]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'question_created': return '❓';
      case 'question_updated': return '✏️';
      case 'question_deleted': return '🗑️';
      case 'answer_created': return '💡';
      case 'answer_updated': return '📝';
      case 'answer_deleted': return '🗑️';
      case 'question_voted': return '👍';
      case 'answer_voted': return '👍';
      case 'question_saved': return '❤️';
      case 'answer_saved': return '❤️';
      case 'question_unsaved': return '💔';
      case 'answer_unsaved': return '💔';
      case 'file_uploaded': return '📎';
      case 'profile_updated': return '👤';
      default: return '📝';
    }
  };

  const getActivityMessage = (activity: Activity) => {
    const { type, metadata } = activity;
    
    switch (type) {
      case 'question_created':
        return `Created a question: "${metadata.title}"`;
      case 'question_updated':
        return `Updated question: "${metadata.title}"`;
      case 'question_deleted':
        return `Deleted question: "${metadata.title}"`;
      case 'answer_created':
        return `Answered a question${metadata.questionTitle ? `: "${metadata.questionTitle}"` : ''}`;
      case 'answer_updated':
        return `Updated an answer`;
      case 'answer_deleted':
        return `Deleted an answer`;
      case 'question_voted':
        return `Voted on a question`;
      case 'answer_voted':
        return `Voted on an answer`;
      case 'question_saved':
        return `Saved question: "${metadata.title}"`;
      case 'answer_saved':
        return `Saved an answer`;
      case 'question_unsaved':
        return `Unsaved a question`;
      case 'answer_unsaved':
        return `Unsaved an answer`;
      case 'file_uploaded':
        return `Uploaded a ${metadata.fileType} file`;
      case 'profile_updated':
        return `Updated profile information`;
      default:
        return `Performed ${String(type).replace('_', ' ')}`;
    }
  };

  const getActivityColor = (type: string) => {
    if (type.includes('created')) return 'text-green-600 dark:text-green-400';
    if (type.includes('updated')) return 'text-blue-600 dark:text-blue-400';
    if (type.includes('deleted')) return 'text-red-600 dark:text-red-400';
    if (type.includes('voted')) return 'text-purple-600 dark:text-purple-400';
    if (type.includes('saved')) return 'text-pink-600 dark:text-pink-400';
    if (type.includes('uploaded')) return 'text-indigo-600 dark:text-indigo-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const activityTypes = [
    { value: 'all', label: 'All Activities', count: 0 },
    { value: 'question_created', label: 'Questions', count: 0 },
    { value: 'answer_created', label: 'Answers', count: 0 },
    { value: 'question_saved', label: 'Saved', count: 0 },
    { value: 'file_uploaded', label: 'Uploads', count: 0 }
  ];

  if (loading && page === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
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
          Activity Feed
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      {activities.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activity yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your activity will appear here as you engage with the community
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <div key={activity._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    activity.type.includes('created') ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.type.includes('updated') ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type.includes('deleted') ? 'bg-red-100 dark:bg-red-900/30' :
                    activity.type.includes('voted') ? 'bg-purple-100 dark:bg-purple-900/30' :
                    activity.type.includes('saved') ? 'bg-pink-100 dark:bg-pink-900/30' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                        {getActivityMessage(activity)}
                      </p>
                      <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {formatTimeAgo(activity.createdAt)}
                      </time>
                    </div>
                    
                    {/* Additional metadata */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {activity.metadata.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-2">
                            {activity.metadata.category}
                          </span>
                        )}
                        {activity.metadata.difficulty && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                            activity.metadata.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            activity.metadata.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {activity.metadata.difficulty}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {pagination && pagination.hasNext && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => fetchActivities(page + 1, filter)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Load More Activities'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
