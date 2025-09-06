import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
//import { firebaseAuthService } from '../services/firebaseAuthService';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Google registration failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isFormValid = formData.username && formData.email && isPasswordValid && doPasswordsMatch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-soft">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Join Our Community!
          </h1>
          <p className="text-neutral-600">
            Start your English learning adventure today
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-large border border-neutral-100 p-8 animate-scale-in">
          {error && (
            <div className="mb-6 bg-error-50 border border-error-200 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-error-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-error-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-neutral-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="block w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-neutral-700 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'student'})}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.role === 'student' 
                      ? 'border-secondary-300 bg-secondary-50 text-secondary-700' 
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <BookOpenIcon className="w-8 h-8 text-secondary-500" />
                  </div>
                  <div className="font-medium">Student</div>
                  <div className="text-xs opacity-75">Learning English</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'teacher'})}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.role === 'teacher' 
                      ? 'border-secondary-300 bg-secondary-50 text-secondary-700' 
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <PresentationChartLineIcon className="w-8 h-8 text-secondary-500" />
                  </div>
                  <div className="font-medium">Teacher</div>
                  <div className="text-xs opacity-75">Teaching English</div>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center space-x-2">
                  <CheckCircleIcon className={`w-4 h-4 ${isPasswordValid ? 'text-success-500' : 'text-neutral-300'}`} />
                  <span className={`text-xs ${isPasswordValid ? 'text-success-600' : 'text-neutral-500'}`}>
                    At least 6 characters
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center space-x-2">
                  <CheckCircleIcon className={`w-4 h-4 ${doPasswordsMatch ? 'text-success-500' : 'text-error-500'}`} />
                  <span className={`text-xs ${doPasswordsMatch ? 'text-success-600' : 'text-error-600'}`}>
                    {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-soft flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <LoadingSpinner size="small" className="text-white" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500 font-medium">Or register with</span>
              </div>
            </div>
          </div>

          {/* Google Register Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading || isLoading}
            className="w-full bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-soft flex items-center justify-center space-x-3"
          >
            {isGoogleLoading ? (
              <LoadingSpinner size="small" className="text-neutral-600" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-center text-neutral-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-secondary-600 hover:text-secondary-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center">
            Join thousands of English learners worldwide!
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success-400 to-success-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-neutral-700 font-medium">Ask questions anytime, anywhere</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-neutral-700 font-medium">Get answers from native speakers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-neutral-700 font-medium">Track your learning progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
