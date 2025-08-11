import express from 'express';
import {
  generateExercises,
  generateExercisesFromContent,
  generatePersonalizedExercises,
  getExercises,
  getExercise,
  getUserExercises,
  updateExercise,
  deleteExercise,
  submitExerciseAnswer
} from '../controllers/exerciseController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getExercises);
router.get('/:id', getExercise);

// Protected routes (authentication required)
router.use(authenticate);

// Exercise generation routes
router.post('/generate', generateExercises);
router.post('/generate-from-content', generateExercisesFromContent);
router.post('/generate-personalized', generatePersonalizedExercises);

// Exercise management routes
router.get('/user/:userId?', getUserExercises);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

// Exercise interaction routes
router.post('/:id/submit', submitExerciseAnswer);

// Admin/Teacher only routes
router.route('/admin')
  .get(authorize('admin', 'teacher'), getExercises)
  .post(authorize('admin', 'teacher'), generateExercises);

export default router;
