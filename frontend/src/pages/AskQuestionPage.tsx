import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionService } from '../services/questionService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedFileUpload from '../components/EnhancedFileUpload';
import { 
  QuestionMarkCircleIcon,
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
  EyeIcon,
  MusicalNoteIcon,
  LanguageIcon,
  BeakerIcon,
  AdjustmentsVerticalIcon,
  FireIcon,
  BookOpenIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const AskQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    difficulty: '',
    tags: '',
    attachments: [] as Array<{
      id: string;
      url: string;
      publicId: string;
      filename: string;
      originalName: string;
      fileType: 'image' | 'audio';
      size: number;
    }>
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const categories = [
    { value: 'grammar', label: 'Grammar', icon: PencilIcon, description: 'Sentence structure, tenses, parts of speech' },
    { value: 'vocabulary', label: 'Vocabulary', icon: BookOpenIcon, description: 'Word meanings, synonyms, usage' },
    { value: 'pronunciation', label: 'Pronunciation', icon: SpeakerWaveIcon, description: 'How to say words correctly' },
    { value: 'writing', label: 'Writing', icon: PencilIcon, description: 'Essays, emails, creative writing' },
    { value: 'speaking', label: 'Speaking', icon: ChatBubbleOvalLeftEllipsisIcon, description: 'Conversation, presentations, fluency' },
    { value: 'reading', label: 'Reading', icon: EyeIcon, description: 'Comprehension, literature, analysis' },
    { value: 'listening', label: 'Listening', icon: MusicalNoteIcon, description: 'Understanding audio, accents' },
    { value: 'other', label: 'Other', icon: LanguageIcon, description: 'General English questions' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', icon: BeakerIcon, description: 'Just starting to learn English' },
    { value: 'intermediate', label: 'Intermediate', icon: AdjustmentsVerticalIcon, description: 'Can handle everyday conversations' },
    { value: 'advanced', label: 'Advanced', icon: FireIcon, description: 'Fluent with complex topics' }
  ];

  const steps = [
    { title: 'Question Title', icon: QueueListIcon },
    { title: 'Details', icon: DocumentTextIcon },
    { title: 'Attachments', icon: PaperClipIcon },
    { title: 'Category & Level', icon: TagIcon },
    { title: 'Review & Post', icon: CheckCircleIcon }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    if (!formData.title.trim() || !formData.content.trim() || !formData.category || !formData.difficulty) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Convert tags string to array
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const response = await questionService.createQuestion({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category as any,
        difficulty: formData.difficulty as any,
        tags,
        attachments: formData.attachments
      });

      // Redirect to the newly created question
      navigate(`/questions/${response.question._id}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create question');
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
      case 3: return formData.category && formData.difficulty;
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
                        {categories.map((category) => (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => setFormData({...formData, category: category.value})}
                            className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                              formData.category === category.value 
                                ? 'border-primary-300 bg-primary-50 shadow-medium' 
                                : 'border-neutral-200 hover:border-neutral-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="p-2 bg-primary-100 rounded-lg">
                                <category.icon className="w-6 h-6 text-primary-600" />
                              </div>
                              <span className="font-semibold text-neutral-900">{category.label}</span>
                            </div>
                            <p className="text-xs text-neutral-600">{category.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Difficulty Level</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {difficulties.map((difficulty) => (
                          <button
                            key={difficulty.value}
                            type="button"
                            onClick={() => setFormData({...formData, difficulty: difficulty.value})}
                            className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-105 ${
                              formData.difficulty === difficulty.value 
                                ? 'border-secondary-300 bg-secondary-50 shadow-medium' 
                                : 'border-neutral-200 hover:border-neutral-300 bg-white'
                            }`}
                          >
                            <div className="flex justify-center mb-2">
                              <div className="p-3 bg-secondary-100 rounded-xl">
                                <difficulty.icon className="w-8 h-8 text-secondary-600" />
                              </div>
                            </div>
                            <div className="font-semibold text-neutral-900 mb-1">{difficulty.label}</div>
                            <p className="text-xs text-neutral-600">{difficulty.description}</p>
                          </button>
                        ))}
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
                            <div className="bg-white rounded-xl p-4 border border-neutral-200 space-y-2">
                              {formData.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                  <div className="flex justify-center">
                                    {attachment.fileType === 'image' ? (
                                      <PhotoIcon className="w-5 h-5 text-blue-500" />
                                    ) : (
                                      <MusicalNoteIcon className="w-5 h-5 text-purple-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{attachment.originalName}</p>
                                    <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-neutral-700">Category:</span>
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                              {categories.find(c => c.value === formData.category)?.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-neutral-700">Level:</span>
                            <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                              {difficulties.find(d => d.value === formData.difficulty)?.label}
                            </span>
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
    </div>
  );
};

export default AskQuestionPage;
