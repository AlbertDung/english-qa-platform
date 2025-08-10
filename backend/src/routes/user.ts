import express from 'express';
import {
  getUserQuestions,
  getUserAnswers,
  deleteUserQuestion,
  deleteUserAnswer,
  saveContent,
  unsaveContent,
  getSavedContent,
  getUserActivity,
  updateUserProfile
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// User content management routes
router.get('/questions/:userId?', authenticate, getUserQuestions);
router.get('/answers/:userId?', authenticate, getUserAnswers);
router.delete('/questions/:questionId', authenticate, deleteUserQuestion);
router.delete('/answers/:answerId', authenticate, deleteUserAnswer);

// Saved content routes
router.post('/saved-content', authenticate, saveContent);
router.delete('/saved-content', authenticate, unsaveContent);
router.get('/saved-content', authenticate, getSavedContent);

// Activity tracking routes
router.get('/activity/:userId?', authenticate, getUserActivity);

// Profile management routes
router.put('/profile', authenticate, updateUserProfile);

export default router;
