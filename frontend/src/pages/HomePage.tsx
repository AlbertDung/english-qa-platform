import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Question } from '../types';
import { questionService } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  PlusIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  SparklesIcon,
  PencilIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EyeIcon,
  MusicalNoteIcon,
  LanguageIcon,
  BeakerIcon,
  AdjustmentsVerticalIcon,
  FireIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
    sort: 'newest'
  });

  const availableCategories = [
    'grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 
    'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'
  ];

  const availableDifficulties = [
    'beginner', 'intermediate', 'advanced', 'expert'
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) {
        params.append('categories', filters.category);
      }
      if (filters.difficulty) {
        params.append('difficultyLevels', filters.difficulty);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }
      
      const response = await questionService.getQuestions({
        page: 1,
        limit: 10,
        category: filters.category || undefined,
        difficulty: filters.difficulty || undefined,
        search: filters.search || undefined,
        sort: filters.sort as any
      });
      setQuestions(response.questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    handleFilterChange('search', search);
  };

  const categories = [
    { value: 'grammar', label: 'Grammar', icon: PencilIcon, color: 'from-blue-400 to-blue-600' },
    { value: 'vocabulary', label: 'Vocabulary', icon: DocumentTextIcon, color: 'from-purple-400 to-purple-600' },
    { value: 'pronunciation', label: 'Pronunciation', icon: SpeakerWaveIcon, color: 'from-pink-400 to-pink-600' },
    { value: 'writing', label: 'Writing', icon: PencilIcon, color: 'from-indigo-400 to-indigo-600' },
    { value: 'speaking', label: 'Speaking', icon: ChatBubbleOvalLeftEllipsisIcon, color: 'from-orange-400 to-orange-600' },
    { value: 'reading', label: 'Reading', icon: EyeIcon, color: 'from-green-400 to-green-600' },
    { value: 'listening', label: 'Listening', icon: MusicalNoteIcon, color: 'from-yellow-400 to-yellow-600' },
    { value: 'other', label: 'Other', icon: LanguageIcon, color: 'from-gray-400 to-gray-600' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', icon: BeakerIcon, color: 'from-green-400 to-green-600' },
    { value: 'intermediate', label: 'Intermediate', icon: AdjustmentsVerticalIcon, color: 'from-yellow-400 to-yellow-600' },
    { value: 'advanced', label: 'Advanced', icon: FireIcon, color: 'from-red-400 to-red-600' }
  ];

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'newest').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <AcademicCapIcon className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Learn English Together
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Ask questions, share knowledge, and improve your English with our friendly community
            </p>
            <Link
              to="/ask"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Ask Your First Question</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{questions.length}</p>
                <p className="text-neutral-600">Active Questions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-success-400 to-success-600 rounded-xl">
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {questions.filter(q => q.acceptedAnswer).length}
                </p>
                <p className="text-neutral-600">Solved Questions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">Learning</p>
                <p className="text-neutral-600">Every Day</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="xl:w-80">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <div className="xl:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-left hover:border-primary-200 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-neutral-400" />
                  <span className="font-medium text-neutral-700">
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </span>
                </button>
              </div>

              {/* Filters Panel */}
              <div className={`${showFilters ? 'block' : 'hidden xl:block'} space-y-6`}>
                {/* Search */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Search</span>
                  </h3>
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        name="search"
                        type="text"
                        placeholder="Search questions..."
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        defaultValue={filters.search}
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                    </div>
                  </form>
                </div>

                {/* Category Filter */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        filters.category === '' 
                          ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                          : 'hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="font-medium">All Categories</span>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleFilterChange('category', category.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${
                          filters.category === category.value 
                            ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                            : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <category.icon className="w-5 h-5" />
                        <span className="font-medium">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Difficulty</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('difficulty', '')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        filters.difficulty === '' 
                          ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                          : 'hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="font-medium">All Levels</span>
                    </button>
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty.value}
                        onClick={() => handleFilterChange('difficulty', difficulty.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${
                          filters.difficulty === difficulty.value 
                            ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                            : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <difficulty.icon className="w-5 h-5" />
                        <span className="font-medium">{difficulty.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Sort By</h3>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="votes">Most Votes</option>
                    <option value="views">Most Views</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Content Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-neutral-900">
                  {filters.search ? `Search Results` : 'Recent Questions'}
                </h2>
                <p className="text-neutral-600 mt-1">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <LoadingSpinner size="large" />
                <p className="text-neutral-500 mt-4">Loading questions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
                <div className="p-4 bg-error-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-error-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Something went wrong</h3>
                <p className="text-error-600 mb-6">{error}</p>
                <button
                  onClick={fetchQuestions}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
                <div className="p-4 bg-primary-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpenIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No questions yet</h3>
                <p className="text-neutral-600 mb-6">
                  {filters.search || filters.category || filters.difficulty 
                    ? 'Try adjusting your filters or search terms.' 
                    : 'Be the first to ask a question!'
                  }
                </p>
                <Link
                  to="/ask"
                  className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Ask Question</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <QuestionCard question={question} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
