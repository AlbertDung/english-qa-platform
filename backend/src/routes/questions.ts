import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getQuestions)
  .post(authenticate, createQuestion);

router.route('/:id')
  .get(getQuestion)
  .put(authenticate, updateQuestion)
  .delete(authenticate, deleteQuestion);

export default router;
