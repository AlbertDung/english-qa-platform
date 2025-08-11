import { Response } from 'express';
import Question from '../models/Question';
import Answer from '../models/Answer';
import Vote from '../models/Vote';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/auth';
import { sanitizeHtml } from '../utils/helpers';

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags, difficultyLevels, categories, attachments } = req.body;

    if (!title || !content || !categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Title, content, and at least one category are required' });
    }

    // Validate categories
    const validCategories = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'];
    const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
    if (invalidCategories.length > 0) {
      return res.status(400).json({ message: `Invalid categories: ${invalidCategories.join(', ')}` });
    }

    // Validate difficulty levels if provided
    if (difficultyLevels && Array.isArray(difficultyLevels)) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
      const invalidDifficulties = difficultyLevels.filter(diff => !validDifficulties.includes(diff));
      if (invalidDifficulties.length > 0) {
        return res.status(400).json({ message: `Invalid difficulty levels: ${invalidDifficulties.join(', ')}` });
      }
    }

    // Prepare question data
    const questionData: any = {
      title,
      content: sanitizeHtml(content),
      tags: tags || [],
      difficultyLevels: difficultyLevels || ['beginner'], // Default to beginner if none provided
      categories,
      author: req.user!._id
    };

    // Add attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      questionData.attachments = attachments.map((att: any) => ({
        type: att.fileType || att.type, // Support both fileType and type
        url: att.url,
        publicId: att.publicId || att.public_id, // Support both publicId and public_id
        originalName: att.originalName || att.filename
      }));
    }

    const question = await Question.create(questionData);

    await question.populate('author', 'username avatar reputation');

    // Log activity
    const activity = new Activity({
      user: req.user!._id,
      type: 'question_created',
      targetId: question._id,
      targetType: 'question',
      metadata: {
        title: question.title,
        categories: question.categories,
        difficultyLevels: question.difficultyLevels
      }
    });
    await activity.save();

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
      categories,
      difficultyLevels,
      sort = 'newest',
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    
    // Handle multiple categories
    if (categories) {
      if (Array.isArray(categories)) {
        filter.categories = { $in: categories };
      } else {
        filter.categories = { $in: [categories] };
      }
    }
    
    // Handle multiple difficulty levels
    if (difficultyLevels) {
      if (Array.isArray(difficultyLevels)) {
        filter.difficultyLevels = { $in: difficultyLevels };
      } else {
        filter.difficultyLevels = { $in: [difficultyLevels] };
      }
    }
    
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
    const { title, content, tags, difficultyLevels, categories, editReason } = req.body;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author or has edit permissions
    const canEdit = question.author.toString() === req.user!._id.toString() || 
                   req.user!.role === 'admin' || 
                   req.user!.role === 'teacher';

    if (!canEdit) {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }

    // Validate categories if provided
    if (categories && Array.isArray(categories)) {
      const validCategories = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'];
      const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
      if (invalidCategories.length > 0) {
        return res.status(400).json({ message: `Invalid categories: ${invalidCategories.join(', ')}` });
      }
    }

    // Validate difficulty levels if provided
    if (difficultyLevels && Array.isArray(difficultyLevels)) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
      const invalidDifficulties = difficultyLevels.filter(diff => !validDifficulties.includes(diff));
      if (invalidDifficulties.length > 0) {
        return res.status(400).json({ message: `Invalid difficulty levels: ${invalidDifficulties.join(', ')}` });
      }
    }

    // Save edit history if content is being changed
    if (content && content !== question.content) {
      question.editHistory.push({
        editedAt: new Date(),
        editedBy: req.user!._id,
        previousContent: question.content,
        editReason: editReason || 'Content updated'
      });
      question.lastEditedAt = new Date();
      question.lastEditedBy = req.user!._id;
    }

    // Update fields
    if (title) question.title = title;
    if (content) question.content = sanitizeHtml(content);
    if (tags) question.tags = tags;
    if (difficultyLevels) question.difficultyLevels = difficultyLevels;
    if (categories) question.categories = categories;

    await question.save();
    await question.populate([
      { path: 'author', select: 'username avatar reputation role' },
      { path: 'lastEditedBy', select: 'username' }
    ]);

    res.json({
      success: true,
      question,
      message: 'Question updated successfully'
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

// Get question edit history
export const getQuestionEditHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('editHistory.editedBy', 'username')
      .select('editHistory title');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({
      success: true,
      editHistory: question.editHistory,
      title: question.title
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk operations for admins/teachers
export const bulkDeleteQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { questionIds } = req.body;

    if (req.user!.role !== 'admin' && req.user!.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized for bulk operations' });
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Question IDs array is required' });
    }

    // Delete related data
    await Answer.deleteMany({ question: { $in: questionIds } });
    await Vote.deleteMany({ target: { $in: questionIds } });
    
    const result = await Question.deleteMany({ _id: { $in: questionIds } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} questions`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
