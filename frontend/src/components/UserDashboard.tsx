import React, { useState, useEffect } from 'react';
import { getUserStats, UserStats } from '../services/userService';
import { User } from '../types';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  user: User;
}

export const UserDashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await getUserStats();
        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <button className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900">Ask Question</div>
              <div className="text-sm text-neutral-500">Get help with English</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-success-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900">Browse Questions</div>
              <div className="text-sm text-neutral-500">Help others learn</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
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
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {stats && stats.recentActivities > 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No recent activity to show</p>
              <p className="text-sm">Start by asking a question or answering others!</p>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2">Welcome to the platform!</p>
              <p className="text-sm">Your activity will appear here as you engage with the community.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
