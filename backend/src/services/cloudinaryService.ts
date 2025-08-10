import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request } from 'express';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter for images and audio
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and audio files
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
    'audio/mp4',
    'audio/ogg'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and audio files are allowed'));
  }
};

// Multer middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload to Cloudinary
export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    resource_type?: 'image' | 'video' | 'auto' | 'raw';
    public_id?: string;
    transformation?: any;
  } = {}
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'english-qa',
      resource_type: options.resource_type || 'auto',
      public_id: options.public_id,
      transformation: options.transformation,
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'auto' | 'raw' = 'image'
): Promise<any> => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

// Generate transformations for different sizes
export const getImageTransformations = {
  thumbnail: { width: 150, height: 150, crop: 'fill' },
  medium: { width: 400, height: 300, crop: 'fill' },
  large: { width: 800, height: 600, crop: 'fill' },
};

export default cloudinary;
