import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserStats, UserStats, getUserActivity } from '../services/userService';
import { User, Activity } from '../types';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ChevronUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  user: User;
}

export const UserDashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStats, activitiesResponse] = await Promise.all([
          getUserStats(),
          getUserActivity(user._id, 1, 5) // Get last 5 activities
        ]);
        
        setStats(userStats);
        if (activitiesResponse.success && activitiesResponse.data?.activities) {
          setRecentActivities(activitiesResponse.data.activities);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  const handleViewAllActivities = () => {
    navigate('/profile?tab=activity');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'question_created':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500" />;
      case 'answer_created':
        return <LightBulbIcon className="w-5 h-5 text-blue-500" />;
      case 'question_edited':
      case 'answer_edited':
        return <PencilIcon className="w-5 h-5 text-yellow-500" />;
      case 'vote_cast':
        return <ChevronUpIcon className="w-5 h-5 text-purple-500" />;
      case 'question_saved':
      case 'answer_saved':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'question_created':
        return 'Created a question';
      case 'answer_created':
        return 'Answered a question';
      case 'question_edited':
        return 'Edited a question';
      case 'answer_edited':
        return 'Edited an answer';
      case 'vote_cast':
        return `Voted on ${activity.targetType}`;
      case 'question_saved':
        return 'Saved a question';
      case 'answer_saved':
        return 'Saved an answer';
      case 'question_unsaved':
        return 'Removed question from saved';
      case 'answer_unsaved':
        return 'Removed answer from saved';
      default:
        return 'Activity performed';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-neutral-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Questions Asked',
      value: stats?.questionsCount || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-primary-500',
      lightBg: 'bg-primary-50',
      textColor: 'text-primary-700'
    },
    {
      title: 'Answers Given',
      value: stats?.answersCount || 0,
      icon: LightBulbIcon,
      color: 'bg-success-500',
      lightBg: 'bg-success-50',
      textColor: 'text-success-700'
    },
    {
      title: 'Saved Items',
      value: stats?.savedItemsCount || 0,
      icon: HeartIcon,
      color: 'bg-secondary-500',
      lightBg: 'bg-secondary-50',
      textColor: 'text-secondary-700'
    },
    {
      title: 'Reputation',
      value: user.reputation || 0,
      icon: StarIcon,
      color: 'bg-warning-500',
      lightBg: 'bg-warning-50',
      textColor: 'text-warning-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.username}!</h1>
            <p className="text-primary-100">
              Continue your English learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.lightBg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/ask-question')} 
            className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900">Ask Question</div>
              <div className="text-sm text-neutral-500">Get help with English</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-success-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900">Browse Questions</div>
              <div className="text-sm text-neutral-500">Help others learn</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/profile?tab=saved')} 
            className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-secondary-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900">Saved Content</div>
              <div className="text-sm text-neutral-500">Review saved items</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Activity
          </h2>
          <button onClick={handleViewAllActivities} className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">
                    {getActivityMessage(activity)}
                  </p>
                                     <p className="text-xs text-neutral-500">
                     {formatTimeAgo(activity.createdAt)}
                   </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No recent activity to show</p>
              <p className="text-sm">Start by asking a question or answering others!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
