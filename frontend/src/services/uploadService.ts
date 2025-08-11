export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    originalName: string;
    type: 'image' | 'audio';
    size: number;
  };
  message?: string;
}

export const uploadFile = async (
  file: File,
  context?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (context) {
    formData.append('context', context);
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${API_BASE_URL}/upload/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadMultipleFiles = async (
  files: File[],
  context?: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; data: Array<{ url: string; publicId: string; originalName: string; type: 'image' | 'audio'; size: number }> }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  if (context) {
    formData.append('context', context);
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

export const deleteFile = async (publicId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Delete failed');
    }

    return data;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSizes = {
    image: 10 * 1024 * 1024, // 10MB
    audio: 50 * 1024 * 1024  // 50MB
  };

  const allowedTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac']
  };

  // Determine file type
  let fileCategory: 'image' | 'audio' | null = null;
  if (allowedTypes.image.includes(file.type)) {
    fileCategory = 'image';
  } else if (allowedTypes.audio.includes(file.type)) {
    fileCategory = 'audio';
  }

  if (!fileCategory) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload images (JPEG, PNG, GIF, WebP) or audio files (MP3, WAV, OGG, M4A, AAC).'
    };
  }

  if (file.size > maxSizes[fileCategory]) {
    const maxSizeMB = maxSizes[fileCategory] / (1024 * 1024);
    return {
      isValid: false,
      error: `File size too large. Maximum size for ${fileCategory} files is ${maxSizeMB}MB.`
    };
  }

  return { isValid: true };
};

export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) {
    return '🖼️';
  } else if (fileType.startsWith('audio/')) {
    return '🎵';
  }
  return '📎';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
