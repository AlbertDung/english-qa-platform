import { Request, Response } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService';
import User, { IUser } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// File validation
const validateFileType = (mimetype: string): { isValid: boolean; type: 'image' | 'audio' | null; error?: string } => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'];
  
  if (imageTypes.includes(mimetype)) {
    return { isValid: true, type: 'image' };
  }
  
  if (audioTypes.includes(mimetype)) {
    return { isValid: true, type: 'audio' };
  }
  
  return { 
    isValid: false, 
    type: null, 
    error: 'Unsupported file type. Only images (JPEG, PNG, GIF, WebP) and audio files (MP3, WAV, OGG, M4A, AAC) are allowed.' 
  };
};

const validateFileSize = (size: number, type: 'image' | 'audio'): { isValid: boolean; error?: string } => {
  const maxImageSize = 10 * 1024 * 1024; // 10MB for images
  const maxAudioSize = 50 * 1024 * 1024; // 50MB for audio
  
  if (type === 'image' && size > maxImageSize) {
    return { isValid: false, error: 'Image file size must be less than 10MB' };
  }
  
  if (type === 'audio' && size > maxAudioSize) {
    return { isValid: false, error: 'Audio file size must be less than 50MB' };
  }
  
  return { isValid: true };
};

// Upload single file
export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const { buffer, mimetype, originalname, size } = req.file;
    const { folder, context } = req.body; // context can be 'question' or 'answer'

    // Validate file type
    const typeValidation = validateFileType(mimetype);
    if (!typeValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: typeValidation.error
      });
    }

    // Validate file size
    const sizeValidation = validateFileSize(size, typeValidation.type!);
    if (!sizeValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: sizeValidation.error
      });
    }

    // Determine resource type for Cloudinary
    let resourceType: 'image' | 'video' | 'auto' | 'raw' = 'auto';
    if (typeValidation.type === 'image') {
      resourceType = 'image';
    } else if (typeValidation.type === 'audio') {
      resourceType = 'auto'; // Cloudinary handles audio as 'auto'
    }

    // Generate unique public_id with context
    const timestamp = Date.now();
    const userId = req.user?._id;
    const contextFolder = context || 'general';
    const publicId = `${userId}_${contextFolder}_${timestamp}_${originalname.split('.')[0]}`;

    const result = await uploadToCloudinary(buffer, {
      folder: folder || `english-qa/${contextFolder}`,
      resource_type: resourceType,
      public_id: publicId
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: typeValidation.type,
        originalName: originalname,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration // For audio files
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const { folder } = req.body;
    const uploadPromises = req.files.map(async (file) => {
      const { buffer, mimetype, originalname } = file;

      // Determine resource type
      let resourceType: 'image' | 'video' | 'auto' | 'raw' = 'auto';
      if (mimetype.startsWith('image/')) {
        resourceType = 'image';
      } else if (mimetype.startsWith('audio/')) {
        resourceType = 'auto';
      }

      // Generate unique public_id
      const timestamp = Date.now();
      const publicId = `${req.user?.id}_${timestamp}_${originalname.split('.')[0]}`;

      return uploadToCloudinary(buffer, {
        folder: folder || 'english-qa/uploads',
        resource_type: resourceType,
        public_id: publicId
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: (req.files as Express.Multer.File[]).map((file, index) => {
        const result = results[index];
        return {
          url: result.secure_url,
          publicId: result.public_id,
          type: file.mimetype.startsWith('image/') ? 'image' : 'audio',
          originalName: file.originalname,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height
        };
      })
    });
  } catch (error: any) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Files upload failed',
      error: error.message
    });
  }
};

// Delete file
export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { publicId, resourceType } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await deleteFromCloudinary(
      publicId, 
      resourceType as 'image' | 'video' | 'auto' | 'raw'
    );

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found or already deleted'
      });
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    });
  }
};

// Get file info
export const getFileInfo = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // This would typically query your database for file metadata
    // For now, we'll just return the Cloudinary URL
    const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;

    res.status(200).json({
      success: true,
      data: {
        publicId,
        url
      }
    });
  } catch (error: any) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file info',
      error: error.message
    });
  }
};
