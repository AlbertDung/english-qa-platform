import { Response } from 'express';
import Answer from '../models/Answer';
import Question from '../models/Question';
import Vote from '../models/Vote';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sanitizeHtml } from '../utils/helpers';

export const createAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = await Answer.create({
      content: sanitizeHtml(content),
      author: req.user!.id,
      question: questionId
    });

    // Add answer to question's answers array
    question.answers.push(answer._id as any);
    await question.save();

    await answer.populate('author', 'username avatar reputation');

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
    const { content } = req.body;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author
    if (answer.author.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to update this answer' });
    }

    answer.content = content ? sanitizeHtml(content) : answer.content;
    await answer.save();
    await answer.populate('author', 'username avatar reputation');

    res.json({
      success: true,
      answer
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
