import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionAnswers
} from '../controllers/questionController';
import { 
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer
} from '../controllers/answerController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getQuestions)
  .post(authenticate, createQuestion);

router.route('/:id')
  .get(getQuestion)
  .put(authenticate, updateQuestion)
  .delete(authenticate, deleteQuestion);

// Nested answer routes
router.route('/:id/answers')
  .get(getQuestionAnswers)
  .post(authenticate, createAnswer);

export default router;
