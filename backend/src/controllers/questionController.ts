import { Response } from 'express';
import Question from '../models/Question';
import Answer from '../models/Answer';
import Vote from '../models/Vote';
import { AuthRequest } from '../middleware/auth';
import { sanitizeHtml } from '../utils/helpers';

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags, difficulty, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const question = await Question.create({
      title,
      content: sanitizeHtml(content),
      tags: tags || [],
      difficulty: difficulty || 'beginner',
      category,
      author: req.user!._id
    });

    await question.populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      question
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      sort = 'newest',
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search as string };
    }

    // Build sort
    let sortOption: any = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'votes':
        sortOption = { votes: -1, createdAt: -1 };
        break;
      case 'views':
        sortOption = { viewCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const questions = await Question.find(filter)
      .populate('author', 'username avatar reputation')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      questions,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('author', 'username avatar reputation')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar reputation'
        },
        options: { sort: { votes: -1, createdAt: -1 } }
      });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count
    question.viewCount += 1;
    await question.save();

    res.json({
      success: true,
      question
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, difficulty, category } = req.body;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author
    if (question.author.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }

    question.title = title || question.title;
    question.content = content ? sanitizeHtml(content) : question.content;
    question.tags = tags || question.tags;
    question.difficulty = difficulty || question.difficulty;
    question.category = category || question.category;

    await question.save();
    await question.populate('author', 'username avatar reputation');

    res.json({
      success: true,
      question
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author or admin
    if (question.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    // Delete related answers and votes
    await Answer.deleteMany({ question: id });
    await Vote.deleteMany({ target: id });

    await Question.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestionAnswers = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = 'oldest' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Check if question exists
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Build sort object
    let sortObj: any = {};
    switch (sort) {
      case 'oldest':
        sortObj.createdAt = 1;
        break;
      case 'newest':
        sortObj.createdAt = -1;
        break;
      case 'votes':
        sortObj.votes = -1;
        break;
      default:
        sortObj.createdAt = 1;
    }

    // Get answers with pagination
    const answers = await Answer.find({ question: id })
      .populate('author', 'username avatar reputation')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Answer.countDocuments({ question: id });

    res.json({
      success: true,
      answers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
