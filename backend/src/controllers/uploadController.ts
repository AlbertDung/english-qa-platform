import { Request, Response } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Upload single file
export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const { buffer, mimetype, originalname } = req.file;
    const { folder } = req.body;

    // Determine resource type based on mimetype
    let resourceType: 'image' | 'video' | 'auto' | 'raw' = 'auto';
    if (mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (mimetype.startsWith('audio/')) {
      resourceType = 'auto'; // Cloudinary handles audio as 'auto'
    }

    // Generate unique public_id
    const timestamp = Date.now();
    const publicId = `${req.user?.id}_${timestamp}_${originalname.split('.')[0]}`;

    const result = await uploadToCloudinary(buffer, {
      folder: folder || 'english-qa/uploads',
      resource_type: resourceType,
      public_id: publicId
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height
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
      data: results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height
      }))
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
