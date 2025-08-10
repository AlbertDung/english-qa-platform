import React, { useState, useEffect } from 'react';
import { saveContent, unsaveContent, isContentSaved } from '../services/userService';

interface SaveButtonProps {
  contentId: string;
  contentType: 'question' | 'answer';
  onToggle?: (isSaved: boolean) => void;
  className?: string;
  showText?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  contentId,
  contentType,
  onToggle,
  className = "",
  showText = false
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await isContentSaved(contentId, contentType);
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkSavedStatus();
  }, [contentId, contentType]);

  const handleToggle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isSaved) {
        await unsaveContent(contentId, contentType);
        setIsSaved(false);
        onToggle?.(false);
      } else {
        await saveContent(contentId, contentType);
        setIsSaved(true);
        onToggle?.(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle save:', error);
      // Show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <button
        disabled
        className={`inline-flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed ${className}`}
      >
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {showText && <span>Loading...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
        isSaved
          ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      title={isSaved ? `Remove ${contentType} from saved` : `Save ${contentType}`}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg 
          className={`h-4 w-4 transition-all duration-200 ${isSaved ? 'fill-current' : 'fill-none'}`} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
      {showText && (
        <span className="font-medium">
          {loading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

interface SaveWithNotesModalProps {
  contentId: string;
  contentType: 'question' | 'answer';
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SaveWithNotesModal: React.FC<SaveWithNotesModalProps> = ({
  contentId,
  contentType,
  isOpen,
  onClose,
  onSave
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent(contentId, contentType, tags, notes);
      onSave();
      onClose();
      // Reset form
      setTags([]);
      setNotes('');
      setTagInput('');
    } catch (error) {
      console.error('Failed to save with notes:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Save {contentType}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personal notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal notes about this content..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
