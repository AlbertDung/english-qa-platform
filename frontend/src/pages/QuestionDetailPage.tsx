import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, Answer, User } from '../types';
import { questionService } from '../services/questionService';
import { answerService } from '../services/answerService';
import { voteService } from '../services/voteService';
import { useAuth } from '../contexts/AuthContext';
import AnswerCard from '../components/AnswerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [error, setError] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuestionAndAnswers();
    }
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setLoading(true);
      const [questionResponse, answersResponse] = await Promise.all([
        questionService.getQuestion(id!),
        answerService.getAnswersByQuestion(id!)
      ]);
      
      setQuestion(questionResponse.question);
      setAnswers(answersResponse.answers);
    } catch (error: any) {
      setError('Failed to fetch question details');
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type: 'up' | 'down', targetType: 'question' | 'answer', targetId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await voteService.vote({
        targetType,
        targetId,
        voteType: type
      });

      // Refresh data to show updated vote counts
      if (targetType === 'question') {
        const response = await questionService.getQuestion(id!);
        setQuestion(response.question);
      } else {
        const response = await answerService.getAnswersByQuestion(id!);
        setAnswers(response.answers);
      }
    } catch (error: any) {
      console.error('Vote failed:', error);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!newAnswer.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await answerService.createAnswer({
        questionId: id!,
        content: newAnswer.trim()
      });

      setNewAnswer('');
      
      // Refresh answers
      const response = await answerService.getAnswersByQuestion(id!);
      setAnswers(response.answers);
    } catch (error: any) {
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!question || question.author._id !== user?._id) {
      return;
    }

    try {
      await answerService.acceptAnswer(answerId);
      
      // Refresh answers to show updated acceptance status
      const response = await answerService.getAnswersByQuestion(id!);
      setAnswers(response.answers);
    } catch (error: any) {
      console.error('Failed to accept answer:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      grammar: 'bg-blue-100 text-blue-800',
      vocabulary: 'bg-purple-100 text-purple-800',
      pronunciation: 'bg-pink-100 text-pink-800',
      writing: 'bg-indigo-100 text-indigo-800',
      speaking: 'bg-orange-100 text-orange-800',
      reading: 'bg-green-100 text-green-800',
      listening: 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Question not found</h2>
          <p className="mt-2 text-gray-600">The question you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Question Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{question.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(question.category)}`}>
                {question.category}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </div>
          </div>
          
          {/* Voting Section */}
          <div className="flex flex-col items-center ml-4">
            <button
              onClick={() => handleVote('up', 'question', question._id)}
              disabled={!isAuthenticated}
              className="p-2 text-gray-400 hover:text-green-500 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-xl font-bold text-gray-900">{question.votes}</span>
            <button
              onClick={() => handleVote('down', 'question', question._id)}
              disabled={!isAuthenticated}
              className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="prose max-w-none mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <span>Asked by </span>
            <span className="font-medium text-gray-700 ml-1">{question.author.username}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{answers.length} answers</span>
            <span>{question.views} views</span>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>
        
        {answers.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600">No answers yet. Be the first to help!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard
                key={answer._id}
                answer={answer}
                onVote={(type) => handleVote(type, 'answer', answer._id)}
                onAccept={() => handleAcceptAnswer(answer._id)}
                canAccept={isAuthenticated && question.author._id === user?._id && !question.acceptedAnswer}
                isAccepted={question.acceptedAnswer === answer._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      {isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Answer</h3>
          
          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-4">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newAnswer.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Post Answer'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">You need to be logged in to post an answer.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Login to Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
