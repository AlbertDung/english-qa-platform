import React, { useState, useRef } from 'react';
import { uploadFile, validateFile, deleteFile, formatFileSize } from '../services/uploadService';
import { useToast } from '../contexts/ToastContext';
import { LightBulbIcon, PhotoIcon, MusicalNoteIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface FileAttachment {
  id: string;
  file?: File;
  url: string;
  publicId: string;
  originalName: string;
  type: 'image' | 'audio';
  size: number;
  isUploading?: boolean;
}

interface EnhancedFileUploadProps {
  onFilesChange: (files: FileAttachment[]) => void;
  context?: 'question' | 'answer';
  maxFiles?: number;
  existingFiles?: FileAttachment[];
  className?: string;
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onFilesChange,
  context = 'question',
  maxFiles = 5,
  existingFiles = [],
  className = ''
}) => {
  const [attachments, setAttachments] = useState<FileAttachment[]>(existingFiles);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const getFileIconComponent = (fileType: string) => {
    if (!fileType) {
      return <PaperClipIcon className="w-5 h-5 text-gray-500" />;
    }
    
    if (fileType.startsWith('image/')) {
      return <PhotoIcon className="w-5 h-5 text-blue-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <MusicalNoteIcon className="w-5 h-5 text-purple-500" />;
    }
    return <PaperClipIcon className="w-5 h-5 text-gray-500" />;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (attachments.length + fileArray.length > maxFiles) {
      addToast(`You can only upload up to ${maxFiles} files`, 'error');
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        addToast(`${file.name}: ${validation.error}`, 'error');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const newAttachments: FileAttachment[] = [];

    try {
      // Upload files one by one to show progress
      for (const file of validFiles) {
        const tempId = `temp_${Date.now()}_${Math.random()}`;
        const tempAttachment: FileAttachment = {
          id: tempId,
          file,
          url: '',
          publicId: '',
          originalName: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'audio',
          size: file.size,
          isUploading: true
        };

        setAttachments(prev => [...prev, tempAttachment]);

        try {
          const response = await uploadFile(file, context);
          
          const uploadedAttachment: FileAttachment = {
            id: response.data.publicId,
            url: response.data.url,
            publicId: response.data.publicId,
            originalName: response.data.originalName || file.name,
            type: response.data.type,
            size: response.data.size,
            isUploading: false
          };

          newAttachments.push(uploadedAttachment);

          // Update the temporary attachment with real data
          setAttachments(prev => 
            prev.map(att => 
              att.id === tempId ? uploadedAttachment : att
            )
          );

        } catch (error: any) {
          addToast(`Failed to upload ${file.name}: ${error.message}`, 'error');
          // Remove the failed upload
          setAttachments(prev => prev.filter(att => att.id !== tempId));
        }
      }

      // Notify parent component
      const updatedAttachments = [...attachments.filter(att => !att.isUploading), ...newAttachments];
      onFilesChange(updatedAttachments);

    } catch (error: any) {
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleRemoveFile = async (attachment: FileAttachment) => {
    try {
      if (attachment.publicId) {
        await deleteFile(attachment.publicId);
      }
      
      const updatedAttachments = attachments.filter(att => att.id !== attachment.id);
      setAttachments(updatedAttachments);
      onFilesChange(updatedAttachments);
      
      addToast('File removed successfully', 'success');
    } catch (error: any) {
      addToast('Failed to remove file', 'error');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              Add attachments (optional)
            </p>
            <p className="text-sm text-gray-500">
              Upload images or audio files to help explain your {context} better
            </p>
          </div>
          
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </button>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>Images (JPEG, PNG, GIF, WebP) up to 10MB</p>
            <p>Audio (MP3, WAV, OGG, M4A, AAC) up to 50MB</p>
            <p>Maximum {maxFiles} files</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Attached Files:</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    {getFileIconComponent(attachment.type || attachment.file?.type || 'unknown')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {attachment.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  {attachment.isUploading && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-xs text-blue-600">Uploading...</span>
                    </div>
                  )}
                </div>
                
                {!attachment.isUploading && (
                  <div className="flex items-center space-x-2">
                    {attachment.url && (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        View
                      </a>
                    )}
                    <button
                      onClick={() => handleRemoveFile(attachment)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <LightBulbIcon className="w-4 h-4 text-blue-900" />
          <h4 className="text-sm font-medium text-blue-900">When to add attachments:</h4>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload screenshots of text you're confused about</li>
          <li>• Share audio recordings of pronunciation attempts</li>
          <li>• Include images of handwritten work for feedback</li>
          <li>• Add visual examples to clarify your {context}</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedFileUpload;
