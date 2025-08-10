import express from 'express';
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  getAnswerEditHistory,
  bulkDeleteAnswers
} from '../controllers/answerController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Bulk operations
router.route('/bulk/delete')
  .post(authenticate, bulkDeleteAnswers);

// Individual answer operations (for direct access)
router.put('/:id', authenticate, updateAnswer);
router.delete('/:id', authenticate, deleteAnswer);
router.patch('/:id/accept', authenticate, acceptAnswer);

// Edit history
router.route('/:id/edit-history')
  .get(getAnswerEditHistory);

export default router;
