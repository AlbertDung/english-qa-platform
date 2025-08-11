import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronDownIcon, 
  UserIcon, 
  ArrowLeftOnRectangleIcon as LogoutIcon, 
  QuestionMarkCircleIcon, 
  HomeIcon, 
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.username || user.email || 'User';
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                  English Q&A
                </h1>
                <p className="text-xs text-neutral-500 -mt-1">Learn Together</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/ask"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <QuestionMarkCircleIcon className="w-4 h-4" />
                <span>Questions</span>
              </Link>
              <Link
                to="/exercises"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>AI Exercises</span>
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Ask Question Button */}
                <Link
                  to="/ask"
                  className="hidden sm:flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-soft"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Ask Question</span>
                </Link>

                {/* Mobile Ask Button */}
                <Link
                  to="/ask"
                  className="sm:hidden bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-soft"
                >
                  <PlusIcon className="w-5 h-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-lg px-3 py-2 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-neutral-800 truncate max-w-32">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-neutral-500">{user.reputation} reputation</p>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-large z-50 animate-scale-in">
                      <div className="p-4 border-b border-neutral-100">
                        <p className="font-medium text-neutral-800">{getUserDisplayName()}</p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 mt-2">
                          {user.reputation} reputation
                        </span>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                        >
                          <LogoutIcon className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-neutral-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-soft"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
