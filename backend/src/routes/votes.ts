import express from 'express';
import { voteQuestion, voteAnswer } from '../controllers/voteController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/questions/:id', authenticate, voteQuestion);
router.post('/answers/:id', authenticate, voteAnswer);

export default router;
