import express from 'express';
import { voteQuestion, voteAnswer, getUserVoteStatus } from '../controllers/voteController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/questions/:id', authenticate, voteQuestion);
router.post('/answers/:id', authenticate, voteAnswer);
router.get('/:targetType/:id/status', authenticate, getUserVoteStatus);

export default router;
