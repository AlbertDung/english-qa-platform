import { Response } from 'express';
import Vote from '../models/Vote';
import Question from '../models/Question';
import Answer from '../models/Answer';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const voteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ message: 'Vote type must be "up" or "down"' });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.user!.id,
      target: id,
      targetType: 'Question'
    });

    if (existingVote) {
      // User already voted, return message
      return res.status(400).json({ 
        message: `You have already ${existingVote.voteType}voted this question`,
        alreadyVoted: true,
        currentVote: existingVote.voteType
      });
    }

    // Create new vote (only allow one vote per user)
    await Vote.create({
      user: req.user!.id,
      target: id,
      targetType: 'Question',
      voteType
    });

    // Update question vote count
    question.votes += voteType === 'up' ? 1 : -1;
    await question.save();
    
    // Update author reputation
    const change = voteType === 'up' ? 2 : -1;
    await User.findByIdAndUpdate(question.author, { $inc: { reputation: change } });

    res.json({
      success: true,
      votes: question.votes,
      userVote: voteType
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const voteAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ message: 'Vote type must be "up" or "down"' });
    }

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.user!.id,
      target: id,
      targetType: 'Answer'
    });

    if (existingVote) {
      // User already voted, return message
      return res.status(400).json({ 
        message: `You have already ${existingVote.voteType}voted this answer`,
        alreadyVoted: true,
        currentVote: existingVote.voteType
      });
    }

    // Create new vote (only allow one vote per user)
    await Vote.create({
      user: req.user!.id,
      target: id,
      targetType: 'Answer',
      voteType
    });

    // Update answer vote count
    answer.votes += voteType === 'up' ? 1 : -1;
    await answer.save();
    
    // Update author reputation
    const change = voteType === 'up' ? 5 : -1;
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: change } });

    res.json({
      success: true,
      votes: answer.votes,
      userVote: voteType
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserVoteStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { targetType, id } = req.params;
    
    if (!['Question', 'Answer'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    const vote = await Vote.findOne({
      user: req.user!.id,
      target: id,
      targetType
    });

    res.json({
      success: true,
      userVote: vote?.voteType || null,
      hasVoted: !!vote
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
