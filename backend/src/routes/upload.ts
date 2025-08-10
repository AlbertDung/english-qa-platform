import express from 'express';
import { 
  uploadFile, 
  uploadMultipleFiles, 
  deleteFile, 
  getFileInfo 
} from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { upload } from '../services/cloudinaryService';

const router = express.Router();

// Upload single file
router.post('/single', 
  authenticate, 
  upload.single('file'), 
  uploadFile
);

// Upload multiple files (max 5)
router.post('/multiple', 
  authenticate, 
  upload.array('files', 5), 
  uploadMultipleFiles
);

// Delete file
router.delete('/', 
  authenticate, 
  deleteFile
);

// Get file info
router.get('/:publicId', getFileInfo);

export default router;
