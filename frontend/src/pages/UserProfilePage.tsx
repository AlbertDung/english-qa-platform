import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/userService';
import { UserDashboard } from '../components/UserDashboard';
import { SavedContentManager } from '../components/SavedContentManager';
import { ActivityFeed } from '../components/ActivityFeed';
import {
  ChartBarIcon,
  UserIcon,
  HeartIcon,
  ClockIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const UserProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profile: {
      bio: '',
      location: '',
      website: '',
      learningGoals: [] as string[],
      nativeLanguage: '',
      englishLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
    },
    preferences: {
      emailNotifications: true,
      categories: [] as string[],
      difficultyLevel: 'beginner'
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        profile: {
          bio: user.profile?.bio || '',
          location: user.profile?.location || '',
          website: user.profile?.website || '',
          learningGoals: user.profile?.learningGoals || [],
          nativeLanguage: user.profile?.nativeLanguage || '',
          englishLevel: user.profile?.englishLevel || 'beginner'
        },
        preferences: {
          emailNotifications: user.preferences?.emailNotifications ?? true,
          categories: user.preferences?.categories || [],
          difficultyLevel: user.preferences?.difficultyLevel || 'beginner'
        }
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [section, field, subfield] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: subfield ? {
            ...(prev[section as keyof typeof prev] as any)[field],
            [subfield]: type === 'checkbox' ? checked : value
          } : type === 'checkbox' ? checked : value
        }
      }));
    } else {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await updateUserProfile(formData.profile, formData.preferences);
      if (response.data) {
        // Update the user in context with the profile and preferences data
        await updateUser({
          profile: formData.profile,
          preferences: formData.preferences
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
    { id: 'saved', label: 'Saved Content', icon: HeartIcon },
    { id: 'activity', label: 'Activity', icon: ClockIcon }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 mb-8 overflow-hidden">
          {/* Gradient Background Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.username}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-primary-100">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm">{user.role}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <StarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.reputation} reputation</span>
                  </div>
                </div>
                {user.profile?.bio && (
                  <p className="text-primary-100 mt-3 text-sm leading-relaxed max-w-2xl">
                    {user.profile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white px-6">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'dashboard' && <UserDashboard user={user} />}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Profile Settings
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  {isEditing ? (
                    <>
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="profile.bio"
                    value={formData.profile.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="profile.location"
                    value={formData.profile.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Where are you from?"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="profile.website"
                    value={formData.profile.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="https://your-website.com"
                  />
                </div>

                {/* Learning Goals */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Learning Goals
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.profile.learningGoals.map((goal, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          name={`profile.learningGoals.${index}`}
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...formData.profile.learningGoals];
                            newGoals[index] = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                learningGoals: newGoals
                              }
                            }));
                          }}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="e.g., Learn React, Master CSS"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGoals = formData.profile.learningGoals.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                learningGoals: newGoals
                              }
                            }));
                          }}
                          disabled={!isEditing}
                          className="ml-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              learningGoals: [...prev.profile.learningGoals, '']
                            }
                          }));
                        }}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" /> Add Goal
                      </button>
                    )}
                  </div>
                </div>

                {/* Native Language */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Native Language
                  </label>
                  <input
                    type="text"
                    name="profile.nativeLanguage"
                    value={formData.profile.nativeLanguage}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., English, Spanish"
                  />
                </div>

                {/* English Level */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    English Level
                  </label>
                  <select
                    name="profile.englishLevel"
                    value={formData.profile.englishLevel}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">
                        Email Notifications
                      </span>
                      <input
                        type="checkbox"
                        name="preferences.emailNotifications"
                        checked={formData.preferences.emailNotifications}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">
                        Difficulty Level
                      </span>
                      <select
                        name="preferences.difficultyLevel"
                        value={formData.preferences.difficultyLevel}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-6 border-t border-neutral-200">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-sm"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-6 py-2 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-200"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && <SavedContentManager />}

          {activeTab === 'activity' && <ActivityFeed />}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
