import React, { useState, useEffect } from 'react';
import { getUserActivity } from '../services/userService';
import { Activity } from '../types';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  PencilIcon,
  ChevronUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

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
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'question_created': return <ChatBubbleLeftRightIcon className={iconClass} />;
      case 'question_updated': return <PencilIcon className={iconClass} />;
      case 'question_deleted': return <DocumentTextIcon className={iconClass} />;
      case 'answer_created': return <LightBulbIcon className={iconClass} />;
      case 'answer_updated': return <PencilIcon className={iconClass} />;
      case 'answer_deleted': return <DocumentTextIcon className={iconClass} />;
      case 'question_voted': return <ChevronUpIcon className={iconClass} />;
      case 'answer_voted': return <ChevronUpIcon className={iconClass} />;
      case 'question_saved': return <HeartIcon className={iconClass} />;
      case 'answer_saved': return <HeartIcon className={iconClass} />;
      case 'question_unsaved': return <HeartIcon className={iconClass} />;
      case 'answer_unsaved': return <HeartIcon className={iconClass} />;
      case 'file_uploaded': return <DocumentTextIcon className={iconClass} />;
      case 'profile_updated': return <StarIcon className={iconClass} />;
      default: return <DocumentTextIcon className={iconClass} />;
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
    if (type.includes('created')) return 'text-success-600';
    if (type.includes('updated')) return 'text-primary-600';
    if (type.includes('deleted')) return 'text-error-600';
    if (type.includes('voted')) return 'text-secondary-600';
    if (type.includes('saved')) return 'text-warning-600';
    if (type.includes('uploaded')) return 'text-info-600';
    return 'text-neutral-600';
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
          <div className="h-8 bg-neutral-200 rounded-xl mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3 mb-4">
              <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-200 rounded-xl mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded-xl w-1/3"></div>
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
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Activity Feed
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No activity yet
          </h3>
          <p className="text-neutral-500">
            Your activity will appear here as you engage with the community
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="divide-y divide-neutral-200">
            {activities.map((activity) => (
              <div key={activity._id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    activity.type.includes('created') ? 'bg-success-100' :
                    activity.type.includes('updated') ? 'bg-primary-100' :
                    activity.type.includes('deleted') ? 'bg-error-100' :
                    activity.type.includes('voted') ? 'bg-secondary-100' :
                    activity.type.includes('saved') ? 'bg-warning-100' :
                    'bg-neutral-100'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                        {getActivityMessage(activity)}
                      </p>
                      <time className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                        {formatTimeAgo(activity.createdAt)}
                      </time>
                    </div>
                    
                    {/* Additional metadata */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-1 text-xs text-neutral-500">
                        {activity.metadata.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 mr-2">
                            {activity.metadata.category}
                          </span>
                        )}
                        {activity.metadata.difficulty && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                            activity.metadata.difficulty === 'beginner' ? 'bg-success-100 text-success-800' :
                            activity.metadata.difficulty === 'intermediate' ? 'bg-warning-100 text-warning-800' :
                            'bg-error-100 text-error-800'
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
            <div className="p-6 border-t border-neutral-200 text-center">
              <button
                onClick={() => fetchActivities(page + 1, filter)}
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
