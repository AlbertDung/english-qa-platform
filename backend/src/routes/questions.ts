import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionAnswers,
  getQuestionEditHistory,
  bulkDeleteQuestions
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

// Bulk operations
router.route('/bulk/delete')
  .post(authenticate, bulkDeleteQuestions);

router.route('/:id')
  .get(getQuestion)
  .put(authenticate, updateQuestion)
  .delete(authenticate, deleteQuestion);

// Edit history
router.route('/:id/edit-history')
  .get(getQuestionEditHistory);

// Nested answer routes
router.route('/:id/answers')
  .get(getQuestionAnswers)
  .post(authenticate, createAnswer);

export default router;
