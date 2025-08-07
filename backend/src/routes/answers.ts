import express from 'express';
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer
} from '../controllers/answerController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/questions/:questionId/answers', authenticate, createAnswer);
router.put('/:id', authenticate, updateAnswer);
router.delete('/:id', authenticate, deleteAnswer);
router.patch('/:id/accept', authenticate, acceptAnswer);

export default router;
