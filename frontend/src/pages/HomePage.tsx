import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Question } from '../types';
import { questionService } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    sort: 'newest',
    search: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionService.getQuestions(filters);
      setQuestions(response.questions);
    } catch (error: any) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    handleFilterChange('search', search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                <option value="grammar">Grammar</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="pronunciation">Pronunciation</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="votes">Most Votes</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
              <p className="text-gray-600 mt-1">
                Ask questions and get answers from the English learning community
              </p>
            </div>
            <Link
              to="/ask"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Ask Question
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                name="search"
                type="text"
                placeholder="Search questions..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                defaultValue={filters.search}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Questions List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchQuestions}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No questions found.</p>
              <Link
                to="/ask"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Be the first to ask a question!
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
