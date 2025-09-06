import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { firebaseAuthService } from '../services/firebaseAuthService';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  SparklesIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-soft">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-neutral-600">
            Continue your English learning journey
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
                  className="block w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
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
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
                  placeholder="Enter your password"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-soft flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <LoadingSpinner size="small" className="text-white" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* OR Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500 font-medium">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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
              New to English Q&A?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-neutral-100">
            <div className="flex justify-center mb-2">
              <SparklesIcon className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-xs text-neutral-600 font-medium">Personalized Learning</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-neutral-100">
            <div className="flex justify-center mb-2">
              <UsersIcon className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-xs text-neutral-600 font-medium">Community Support</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-neutral-100">
            <div className="flex justify-center mb-2">
              <ChartBarIcon className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-xs text-neutral-600 font-medium">Track Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
