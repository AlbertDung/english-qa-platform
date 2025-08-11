import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ExerciseRequest,
  // Exercise,
  ExerciseSet,
  getDifficultyColor,
  getCategoryColor
} from '../services/exerciseService';
import * as exerciseService from '../services/exerciseService';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  SparklesIcon,
  DocumentTextIcon,
  UserIcon,
  // AcademicCapIcon,
  // BeakerIcon,
  // AdjustmentsVerticalIcon,
  // FireIcon,
  // BookOpenIcon,
  // PencilIcon,
  // SpeakerWaveIcon,
  // ChatBubbleOvalLeftEllipsisIcon,
  // MusicalNoteIcon,
  // BuildingOfficeIcon,
  // UserGroupIcon,
  // CogIcon,
  // LanguageIcon,
  ArrowLeftIcon,
  // CheckCircleIcon,
  XMarkIcon,
  // PlayIcon,
  // EyeIcon
} from '@heroicons/react/24/outline';

const ExerciseGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'personalized'>('general');
  const [generatedExercises, setGeneratedExercises] = useState<ExerciseSet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // General exercise generation form
  const [generalForm, setGeneralForm] = useState({
    topic: '',
    difficulty: 'intermediate' as ExerciseRequest['difficulty'],
    exerciseType: 'multiple-choice' as ExerciseRequest['exerciseType'],
    count: 5,
    categories: [] as string[]
  });

  // Content-based exercise generation form
  const [contentForm, setContentForm] = useState({
    content: '',
    difficulty: 'intermediate' as ExerciseRequest['difficulty'],
    exerciseType: 'multiple-choice' as ExerciseRequest['exerciseType'],
    count: 5,
    categories: [] as string[]
  });

  // Personalized exercise generation form
  const [personalizedForm, setPersonalizedForm] = useState({
    difficulty: 'intermediate' as ExerciseRequest['difficulty'],
    exerciseType: 'multiple-choice' as ExerciseRequest['exerciseType'],
    count: 5,
    categories: [] as string[]
  });

  const availableCategories = [
    'grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 
    'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'
  ];

  const availableDifficultyLevels = [
    'beginner', 'intermediate', 'advanced', 'expert'
  ];

  const availableExerciseTypes = [
    'multiple-choice', 'fill-in-blank', 'sentence-correction', 
    'vocabulary', 'grammar', 'pronunciation'
  ];

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCategoryToggle = (formType: 'general' | 'content' | 'personalized', category: string) => {
    if (formType === 'general') {
      setGeneralForm(prev => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      }));
    } else if (formType === 'content') {
      setContentForm(prev => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      }));
    } else if (formType === 'personalized') {
      setPersonalizedForm(prev => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      }));
    }
  };

  // const formState = {
  //   generalForm,
  //   contentForm,
  //   personalizedForm
  // };

  // const setFormState = {
  //   generalForm: setGeneralForm,
  //   contentForm: setContentForm,
  //   personalizedForm: setPersonalizedForm
  // };

  const handleGenerateExercises = async (formType: 'general' | 'content' | 'personalized') => {
    setIsGenerating(true);
    setError('');
    setGeneratedExercises(null);
    setCurrentExercise(0);
    setUserAnswers({});
    setShowResults(false);

    try {
      let result;

      switch (formType) {
        case 'general':
          if (!generalForm.topic.trim()) {
            throw new Error('Please enter a topic for the exercises');
          }
          result = await exerciseService.generateExercises(generalForm);
          break;
        
        case 'content':
          if (!contentForm.content.trim()) {
            throw new Error('Please enter content to generate exercises from');
          }
          result = await exerciseService.generateExercisesFromContent(contentForm.content, {
            difficulty: contentForm.difficulty,
            exerciseType: contentForm.exerciseType,
            count: contentForm.count,
            categories: contentForm.categories
          });
          break;
        
        case 'personalized':
          result = await exerciseService.generatePersonalizedExercises(personalizedForm);
          break;
        
        default:
          throw new Error('Invalid tab selected');
      }

      if (result.success && result.data) {
        setGeneratedExercises(result.data);
      } else {
        setError(result.message || 'Failed to generate exercises');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to generate exercises');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (exerciseIndex: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answer
    }));
  };

  const handleSubmitAnswer = (exerciseIndex: number) => {
    if (exerciseIndex < (generatedExercises?.exercises.length || 0) - 1) {
      setCurrentExercise(exerciseIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  // const getCategoryIcon = (category: string) => {
  //   switch (category) {
  //     case 'grammar': return PencilIcon;
  //     case 'vocabulary': return DocumentTextIcon;
  //     case 'pronunciation': return SpeakerWaveIcon;
  //     case 'writing': return PencilIcon;
  //     case 'speaking': return ChatBubbleOvalLeftEllipsisIcon;
  //     case 'reading': return BookOpenIcon;
  //     case 'listening': return MusicalNoteIcon;
  //     case 'business': return BuildingOfficeIcon;
  //     case 'academic': return AcademicCapIcon;
  //     case 'casual': return UserGroupIcon;
  //     case 'technical': return CogIcon;
  //     default: return LanguageIcon;
  //   }
  // };

  // const getDifficultyIcon = (difficulty: string) => {
  //   switch (difficulty) {
  //     case 'beginner': return BeakerIcon;
  //     case 'intermediate': return AdjustmentsVerticalIcon;
  //     case 'advanced': return FireIcon;
  //     case 'expert': return AcademicCapIcon;
  //     default: return BeakerIcon;
  //   }
  // };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 shadow-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold text-neutral-900">AI Exercise Generator</h1>
                <p className="text-neutral-600">Create personalized English learning exercises with AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-6 h-6 text-primary-500" />
              <span className="text-sm font-medium text-neutral-700">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Exercise Generator Forms */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Generate Exercises</h3>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'general'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <SparklesIcon className="w-4 h-4 inline mr-2" />
                  General
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'content'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('personalized')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'personalized'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Personal
                </button>
              </div>

              {/* General Exercise Form */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={generalForm.topic}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="e.g., Past Perfect Tense, Business Vocabulary"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={generalForm.difficulty}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {availableDifficultyLevels.map(level => (
                        <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Exercise Type
                    </label>
                    <select
                      value={generalForm.exerciseType}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, exerciseType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {availableExerciseTypes.map(type => (
                        <option key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Number of Exercises
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={generalForm.count}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Categories (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryToggle('general', category)}
                          className={`p-2 text-xs rounded-lg border transition-all ${
                            generalForm.categories.includes(category)
                              ? 'border-primary-300 bg-primary-50 text-primary-700'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content-based Exercise Form */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={contentForm.content}
                      onChange={(e) => setContentForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Paste or type English content here to generate relevant exercises..."
                      rows={6}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={contentForm.difficulty}
                        onChange={(e) => setContentForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {availableDifficultyLevels.map(level => (
                          <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Exercise Type
                      </label>
                      <select
                        value={contentForm.exerciseType}
                        onChange={(e) => setContentForm(prev => ({ ...prev, exerciseType: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {availableExerciseTypes.map(type => (
                          <option key={type} value={type}>
                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Number of Exercises
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={contentForm.count}
                      onChange={(e) => setContentForm(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Personalized Exercise Form */}
              {activeTab === 'personalized' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Personalized for you</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Based on your profile: {user?.profile?.englishLevel || 'beginner'} level, 
                      preferred categories: {user?.preferences?.categories?.join(', ') || 'grammar'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={personalizedForm.difficulty}
                        onChange={(e) => setPersonalizedForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {availableDifficultyLevels.map(level => (
                          <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Exercise Type
                      </label>
                      <select
                        value={personalizedForm.exerciseType}
                        onChange={(e) => setPersonalizedForm(prev => ({ ...prev, exerciseType: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {availableExerciseTypes.map(type => (
                          <option key={type} value={type}>
                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Number of Exercises
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={personalizedForm.count}
                      onChange={(e) => setPersonalizedForm(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={() => handleGenerateExercises(activeTab)}
                disabled={isGenerating}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="small" className="text-white" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <SparklesIcon className="w-5 h-5" />
                    <span>Generate Exercises</span>
                  </div>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XMarkIcon className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Exercise Display */}
          <div className="lg:col-span-2">
            {!generatedExercises ? (
              <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Ready to Generate Exercises?
                </h3>
                <p className="text-neutral-600 mb-6">
                  Choose your preferred method and customize the parameters to create engaging English learning exercises.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <SparklesIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-neutral-900 mb-1">General</h4>
                    <p className="text-sm text-neutral-600">Create exercises on any topic with custom parameters</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <DocumentTextIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-medium text-neutral-900 mb-1">Content-based</h4>
                    <p className="text-sm text-neutral-600">Generate exercises from existing text or content</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <UserIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-neutral-900 mb-1">Personalized</h4>
                    <p className="text-sm text-neutral-600">AI creates exercises tailored to your learning profile</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Exercise Set Header */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {generatedExercises.metadata.topic}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(generatedExercises.metadata.difficulty)}`}>
                        {generatedExercises.metadata.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {generatedExercises.metadata.exerciseType}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Exercises:</span>
                      <span className="ml-2 font-medium">{generatedExercises.metadata.totalCount}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Time:</span>
                      <span className="ml-2 font-medium">{generatedExercises.metadata.estimatedTime}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500">Objectives:</span>
                      <span className="ml-2 font-medium">{generatedExercises.metadata.learningObjectives.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Exercise Display */}
                {!showResults ? (
                  <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-neutral-900">
                        Exercise {currentExercise + 1} of {generatedExercises.exercises.length}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(generatedExercises.exercises[currentExercise].difficulty)}`}>
                          {generatedExercises.exercises[currentExercise].difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(generatedExercises.exercises[currentExercise].category)}`}>
                          {generatedExercises.exercises[currentExercise].category}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-lg text-neutral-900 mb-4">
                        {generatedExercises.exercises[currentExercise].question}
                      </p>

                      {generatedExercises.exercises[currentExercise].options && (
                        <div className="space-y-3">
                          {generatedExercises.exercises[currentExercise].options!.map((option, index) => (
                            <label key={index} className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                              <input
                                type="radio"
                                name={`exercise-${currentExercise}`}
                                value={option}
                                checked={userAnswers[currentExercise] === option}
                                onChange={(e) => handleAnswerChange(currentExercise, e.target.value)}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-neutral-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                        disabled={currentExercise === 0}
                        className="px-4 py-2 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handleSubmitAnswer(currentExercise)}
                        disabled={!userAnswers[currentExercise]}
                        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentExercise === generatedExercises.exercises.length - 1 ? 'Finish' : 'Next'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Results Display */
                  <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-6">Exercise Results</h4>
                    <div className="space-y-4">
                      {generatedExercises.exercises.map((exercise, index) => (
                        <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-neutral-900">
                              Exercise {index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                {exercise.difficulty}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(exercise.category)}`}>
                                {exercise.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-neutral-700 mb-3">{exercise.question}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-neutral-500">Your answer:</span>
                              <span className="ml-2 text-sm font-medium">{userAnswers[index] || 'Not answered'}</span>
                            </div>
                            <div>
                              <span className="text-sm text-neutral-500">Correct answer:</span>
                              <span className="ml-2 text-sm font-medium text-green-600">{exercise.correctAnswer}</span>
                            </div>
                            <div>
                              <span className="text-sm text-neutral-500">Explanation:</span>
                              <p className="mt-1 text-sm text-neutral-700 bg-neutral-50 p-3 rounded">{exercise.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => {
                          setGeneratedExercises(null);
                          setCurrentExercise(0);
                          setUserAnswers({});
                          setShowResults(false);
                        }}
                        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Generate New Exercises
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseGeneratorPage;
