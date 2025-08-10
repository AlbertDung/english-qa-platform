import { Response } from 'express';
import Answer from '../models/Answer';
import Question from '../models/Question';
import Vote from '../models/Vote';
import User from '../models/User';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/auth';
import { sanitizeHtml } from '../utils/helpers';

export const createAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id: questionId } = req.params; // Fix: Use id from route params
    const { content, attachments } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Prepare answer data
    const answerData: any = {
      content: sanitizeHtml(content),
      author: req.user!._id,
      question: questionId
    };

    // Add attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      answerData.attachments = attachments.map((att: any) => ({
        type: att.fileType,
        url: att.url,
        publicId: att.publicId,
        originalName: att.originalName || att.filename
      }));
    }

    const answer = await Answer.create(answerData);

    // Add answer to question's answers array
    question.answers.push(answer._id as any);
    await question.save();

    await answer.populate('author', 'username avatar reputation');

    // Log activity
    const activity = new Activity({
      user: req.user!._id,
      type: 'answer_created',
      targetId: answer._id,
      targetType: 'answer',
      metadata: {
        questionId: questionId,
        questionTitle: question.title,
        hasAttachments: !!(attachments && attachments.length > 0)
      }
    });
    await activity.save();

    res.status(201).json({
      success: true,
      answer
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, editReason } = req.body;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author or has edit permissions
    const canEdit = answer.author.toString() === req.user!.id || 
                   req.user!.role === 'admin' || 
                   req.user!.role === 'teacher';

    if (!canEdit) {
      return res.status(403).json({ message: 'Not authorized to update this answer' });
    }

    // Save edit history if content is being changed
    if (content && content !== answer.content) {
      answer.editHistory.push({
        editedAt: new Date(),
        editedBy: req.user!._id,
        previousContent: answer.content,
        editReason: editReason || 'Content updated'
      });
      answer.lastEditedAt = new Date();
      answer.lastEditedBy = req.user!._id;
    }

    // Update content
    if (content) {
      answer.content = sanitizeHtml(content);
    }

    await answer.save();
    await answer.populate([
      { path: 'author', select: 'username avatar reputation role' },
      { path: 'lastEditedBy', select: 'username' }
    ]);

    res.json({
      success: true,
      answer,
      message: 'Answer updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author or admin
    if (answer.author.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    // Remove from question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });

    // Delete related votes
    await Vote.deleteMany({ target: id });

    await Answer.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Only question author can accept answers
    if (question.author.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Only question author can accept answers' });
    }

    // Remove previous accepted answer
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    // Set new accepted answer
    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id as any;
    await question.save();

    // Give reputation points to answer author
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 15 } });

    res.json({
      success: true,
      message: 'Answer accepted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get answer edit history
export const getAnswerEditHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id)
      .populate('editHistory.editedBy', 'username')
      .select('editHistory content');

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.json({
      success: true,
      editHistory: answer.editHistory,
      currentContent: answer.content
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk operations for admins/teachers
export const bulkDeleteAnswers = async (req: AuthRequest, res: Response) => {
  try {
    const { answerIds } = req.body;

    if (req.user!.role !== 'admin' && req.user!.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized for bulk operations' });
    }

    if (!Array.isArray(answerIds) || answerIds.length === 0) {
      return res.status(400).json({ message: 'Answer IDs array is required' });
    }

    // Remove answers from questions' answers array
    const answers = await Answer.find({ _id: { $in: answerIds } });
    for (const answer of answers) {
      await Question.findByIdAndUpdate(answer.question, {
        $pull: { answers: answer._id }
      });
    }

    // Delete related votes
    await Vote.deleteMany({ target: { $in: answerIds } });
    
    const result = await Answer.deleteMany({ _id: { $in: answerIds } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} answers`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
