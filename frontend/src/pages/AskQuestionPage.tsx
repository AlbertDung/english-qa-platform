import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionService } from '../services/questionService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedFileUpload from '../components/EnhancedFileUpload';
import { 
  QueueListIcon,
  DocumentTextIcon,
  TagIcon,
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PaperClipIcon,
  PencilIcon,
  SpeakerWaveIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MusicalNoteIcon,
  LanguageIcon,
  BeakerIcon,
  AdjustmentsVerticalIcon,
  FireIcon,
  BookOpenIcon,
  PhotoIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CogIcon,
  DocumentTextIcon as DocIcon
} from '@heroicons/react/24/outline';

const AskQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    difficultyLevels: [] as string[],
    categories: [] as string[],
    attachments: [] as Array<{
      id: string;
      url: string;
      publicId: string;
      originalName: string;
      type: 'image' | 'audio';
      size: number;
    }>
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string; originalName: string } | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const availableCategories = [
    'grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 
    'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'
  ];

  const availableDifficultyLevels = [
    'beginner', 'intermediate', 'advanced', 'expert'
  ];

  const steps = [
    { title: 'Question Title', icon: QueueListIcon },
    { title: 'Details', icon: DocumentTextIcon },
    { title: 'Attachments', icon: PaperClipIcon },
    { title: 'Category & Level', icon: TagIcon },
    { title: 'Review & Post', icon: CheckCircleIcon }
  ];

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleDifficultyToggle = (difficulty: string) => {
    setFormData(prev => ({
      ...prev,
      difficultyLevels: prev.difficultyLevels.includes(difficulty)
        ? prev.difficultyLevels.filter(d => d !== difficulty)
        : [...prev.difficultyLevels, difficulty]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFilesChange = (files: any[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
    setUploadError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim() || formData.categories.length === 0 || formData.difficultyLevels.length === 0) {
      setError('Please select at least one category and one difficulty level');
      return;
    }

    try {
      setSubmitting(true);
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const result = await questionService.createQuestion({
        title: formData.title.trim(),
        content: formData.content.trim(),
        categories: formData.categories,
        difficultyLevels: formData.difficultyLevels,
        tags,
        attachments: formData.attachments
      });

      if (result.success) {
        // Assuming addToast is available from a context or passed as a prop
        // For now, we'll just navigate
        navigate(`/question/${result.question._id}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to post question');
      // Assuming addToast is available from a context or passed as a prop
      // For now, we'll just set error
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.title.trim().length > 0;
      case 1: return formData.content.trim().length > 0;
      case 2: return true; // Attachments are optional
      case 3: return formData.categories.length > 0 && formData.difficultyLevels.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 shadow-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold text-neutral-900">Ask a Question</h1>
                <p className="text-neutral-600">Share your English learning question with the community</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-6 h-6 text-primary-500" />
              <span className="text-sm font-medium text-neutral-700">Step {currentStep + 1} of {steps.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Indicator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Progress</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      isCurrent ? 'bg-primary-50 border border-primary-200' : 
                      isCompleted ? 'bg-success-50 border border-success-200' : 
                      'bg-neutral-50 border border-neutral-200'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent ? 'bg-primary-500' : 
                        isCompleted ? 'bg-success-500' : 
                        'bg-neutral-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className={`font-medium ${
                        isCurrent ? 'text-primary-700' : 
                        isCompleted ? 'text-success-700' : 
                        'text-neutral-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-large border border-neutral-100 overflow-hidden">
              {error && (
                <div className="m-6 mb-0 bg-error-50 border border-error-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <XMarkIcon className="w-5 h-5 text-error-500" />
                    <p className="text-error-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8">
                {/* Step 0: Title */}
                {currentStep === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <QueueListIcon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        What's your question?
                      </h2>
                      <p className="text-neutral-600">
                        Write a clear, specific title that summarizes your English learning question
                      </p>
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-3">
                        Question Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., When should I use 'a' vs 'an' before words?"
                        className="w-full px-4 py-4 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg"
                        autoFocus
                      />
                      <div className="mt-3 flex items-center space-x-2">
                        <span className={`text-sm ${formData.title.length > 10 ? 'text-success-600' : 'text-neutral-500'}`}>
                          {formData.title.length} characters
                        </span>
                        {formData.title.length > 10 && (
                          <CheckCircleIcon className="w-4 h-4 text-success-500" />
                        )}
                      </div>
                    </div>

                    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
                      <div className="flex items-start space-x-3">
                        <LightBulbIcon className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-primary-900 mb-2">Tips for a great title:</h4>
                          <ul className="text-sm text-primary-800 space-y-1">
                            <li>• Be specific and clear</li>
                            <li>• Include key words others might search for</li>
                            <li>• Avoid vague terms like "help" or "question"</li>
                            <li>• Focus on the main concept you're asking about</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Content */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <DocumentTextIcon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        Provide details
                      </h2>
                      <p className="text-neutral-600">
                        Explain your question with examples, context, and what you've tried
                      </p>
                    </div>

                    <div>
                      <label htmlFor="content" className="block text-sm font-semibold text-neutral-700 mb-3">
                        Question Details
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={10}
                        placeholder="Provide context, examples, and specific details about what you're struggling with. The more information you give, the better answers you'll receive..."
                        className="w-full px-4 py-4 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all resize-none"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-sm ${formData.content.length > 50 ? 'text-success-600' : 'text-neutral-500'}`}>
                          {formData.content.length} characters
                        </span>
                        {formData.content.length > 50 && (
                          <div className="flex items-center space-x-2 text-success-600">
                            <CheckCircleIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Good detail level</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Attachments */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <PaperClipIcon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        Add attachments (optional)
                      </h2>
                      <p className="text-neutral-600">
                        Upload images or audio files to help explain your question better
                      </p>
                    </div>

                    <div className="space-y-6">
                      <EnhancedFileUpload
                        onFilesChange={handleFilesChange}
                        context="question"
                        maxFiles={3}
                        existingFiles={formData.attachments}
                        className="w-full"
                      />

                      {/* Preview of uploaded files */}
                      {formData.attachments.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <PaperClipIcon className="w-4 h-4 mr-2 text-gray-500" />
                            Uploaded Files ({formData.attachments.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {formData.attachments.map((attachment, index) => (
                              <div key={index} className="group bg-white hover:bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    {attachment.type === 'image' ? (
                                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <PhotoIcon className="w-5 h-5 text-blue-600" />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <MusicalNoteIcon className="w-5 h-5 text-purple-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                      {attachment.originalName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {attachment.type === 'image' ? 'Image file' : 'Audio file'} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedMedia({
                                        url: attachment.url,
                                        type: attachment.type,
                                        originalName: attachment.originalName
                                      });
                                      setShowMediaModal(true);
                                    }}
                                    className="flex-shrink-0 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 hover:scale-105 transform"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <div className="bg-error-50 border border-error-200 rounded-2xl p-4">
                          <div className="flex items-center space-x-3">
                            <XMarkIcon className="w-5 h-5 text-error-500" />
                            <p className="text-error-700 font-medium">{uploadError}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Category & Difficulty */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-success-400 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TagIcon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        Categorize your question
                      </h2>
                      <p className="text-neutral-600">
                        Help others find your question by selecting the right category and difficulty level
                      </p>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Category</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {availableCategories.map((category) => {
                          const getCategoryIcon = (cat: string) => {
                            switch (cat) {
                              case 'grammar': return PencilIcon;
                              case 'vocabulary': return DocumentTextIcon;
                              case 'pronunciation': return SpeakerWaveIcon;
                              case 'writing': return PencilIcon;
                              case 'speaking': return ChatBubbleOvalLeftEllipsisIcon;
                              case 'reading': return BookOpenIcon;
                              case 'listening': return MusicalNoteIcon;
                              case 'business': return BuildingOfficeIcon;
                              case 'academic': return AcademicCapIcon;
                              case 'casual': return UserGroupIcon;
                              case 'technical': return CogIcon;
                              default: return LanguageIcon;
                            }
                          };
                          
                          const getCategoryColor = (cat: string) => {
                            switch (cat) {
                              case 'grammar': return 'from-blue-400 to-blue-600';
                              case 'vocabulary': return 'from-purple-400 to-purple-600';
                              case 'pronunciation': return 'from-pink-400 to-pink-600';
                              case 'writing': return 'from-indigo-400 to-indigo-600';
                              case 'speaking': return 'from-orange-400 to-orange-600';
                              case 'reading': return 'from-green-400 to-green-600';
                              case 'listening': return 'from-teal-400 to-teal-600';
                              case 'business': return 'from-gray-400 to-gray-600';
                              case 'academic': return 'from-red-400 to-red-600';
                              case 'casual': return 'from-yellow-400 to-yellow-600';
                              case 'technical': return 'from-blue-400 to-blue-600';
                              default: return 'from-neutral-400 to-neutral-600';
                            }
                          };
                          
                          const IconComponent = getCategoryIcon(category);
                          const colorClass = getCategoryColor(category);
                          
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => handleCategoryToggle(category)}
                              className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 group ${
                                formData.categories.includes(category) 
                                  ? 'border-primary-300 bg-primary-50 shadow-medium' 
                                  : 'border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-medium'
                              }`}
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`p-3 bg-gradient-to-br ${colorClass} rounded-xl group-hover:scale-110 transition-transform`}>
                                  <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-semibold text-neutral-900 capitalize">{category}</span>
                              </div>
                              <p className="text-xs text-neutral-600">General category for {category}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Difficulty Level</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {availableDifficultyLevels.map((difficulty) => {
                          const getDifficultyIcon = (diff: string) => {
                            switch (diff) {
                              case 'beginner': return BeakerIcon;
                              case 'intermediate': return AdjustmentsVerticalIcon;
                              case 'advanced': return FireIcon;
                              case 'expert': return AcademicCapIcon;
                              default: return BeakerIcon;
                            }
                          };
                          
                          const getDifficultyColor = (diff: string) => {
                            switch (diff) {
                              case 'beginner': return 'from-green-400 to-green-600';
                              case 'intermediate': return 'from-yellow-400 to-yellow-600';
                              case 'advanced': return 'from-orange-400 to-orange-600';
                              case 'expert': return 'from-purple-400 to-purple-600';
                              default: return 'from-neutral-400 to-neutral-600';
                            }
                          };
                          
                          const IconComponent = getDifficultyIcon(difficulty);
                          const colorClass = getDifficultyColor(difficulty);
                          
                          return (
                            <button
                              key={difficulty}
                              type="button"
                              onClick={() => handleDifficultyToggle(difficulty)}
                              className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-105 group ${
                                formData.difficultyLevels.includes(difficulty) 
                                  ? 'border-secondary-300 bg-secondary-50 shadow-medium' 
                                  : 'border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-medium'
                              }`}
                            >
                              <div className="flex justify-center mb-3">
                                <div className={`p-3 bg-gradient-to-br ${colorClass} rounded-xl group-hover:scale-110 transition-transform`}>
                                  <IconComponent className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="font-semibold text-neutral-900 mb-1 capitalize">{difficulty}</div>
                              <p className="text-xs text-neutral-600">Level of difficulty</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label htmlFor="tags" className="block text-sm font-semibold text-neutral-700 mb-3">
                        Tags (Optional)
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., past-tense, irregular-verbs, prepositions"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all"
                      />
                      <p className="mt-2 text-sm text-neutral-600">
                        Separate multiple tags with commas. Tags help others find your question.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-warning-400 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        Review & Post
                      </h2>
                      <p className="text-neutral-600">
                        Take a final look at your question before posting it to the community
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preview</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Title:</h4>
                          <p className="text-neutral-900">{formData.title}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Content:</h4>
                          <div className="bg-white rounded-xl p-4 border border-neutral-200">
                            <p className="text-neutral-900 whitespace-pre-wrap">{formData.content}</p>
                          </div>
                        </div>

                        {formData.attachments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-neutral-700 mb-2">Attachments:</h4>
                            <div className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3">
                              {formData.attachments.map((attachment, index) => (
                                <div key={index} className="group bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                      {attachment.type === 'image' ? (
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                          <PhotoIcon className="w-6 h-6 text-blue-600" />
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                          <MusicalNoteIcon className="w-6 h-6 text-purple-600" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                        {attachment.originalName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {attachment.type === 'image' ? 'Image file' : 'Audio file'} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setSelectedMedia({
                                          url: attachment.url,
                                          type: attachment.type,
                                          originalName: attachment.originalName
                                        });
                                        setShowMediaModal(true);
                                      }}
                                      className="flex-shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 hover:scale-105 transform"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-neutral-700">Category:</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.categories.map((category, index) => (
                                <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-neutral-700">Level:</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.difficultyLevels.map((difficulty, index) => (
                                <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                                  {difficulty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {formData.tags && (
                          <div>
                            <h4 className="font-semibold text-neutral-700 mb-2">Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                              {formData.tags.split(',').map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm">
                                  #{tag.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-neutral-200 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 px-6 py-3 text-neutral-600 border border-neutral-300 rounded-xl hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
                    >
                      <span>Continue</span>
                      <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || !canProceed()}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none shadow-medium"
                    >
                      {submitting ? (
                        <LoadingSpinner size="small" className="text-white" />
                      ) : (
                        <>
                          <span>Post Question</span>
                          <CheckCircleIcon className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Media Modal */}
      {showMediaModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                {selectedMedia.type === 'image' ? (
                  <PhotoIcon className="w-6 h-6 text-blue-600" />
                ) : (
                  <MusicalNoteIcon className="w-6 h-6 text-purple-600" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedMedia.originalName}
                </h3>
              </div>
              <button
                onClick={() => setShowMediaModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-auto">
              {selectedMedia.type === 'image' ? (
                <div className="flex justify-center">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.originalName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    style={{ maxHeight: '60vh' }}
                  />
                </div>
              ) : selectedMedia.type === 'audio' ? (
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <MusicalNoteIcon className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Audio Player</h4>
                    <p className="text-sm text-gray-600 mb-4">{selectedMedia.originalName}</p>
                    <audio 
                      controls 
                      className="w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
                      preload="metadata"
                    >
                      <source src={selectedMedia.url} type="audio/mpeg" />
                      <source src={selectedMedia.url} type="audio/wav" />
                      <source src={selectedMedia.url} type="audio/ogg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DocIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">Unsupported media type</p>
                  <p className="text-sm mb-4">This file type cannot be previewed directly.</p>
                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in new tab
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestionPage;
