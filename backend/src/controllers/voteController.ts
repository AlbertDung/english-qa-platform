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
      if (existingVote.voteType === voteType) {
        // Remove vote if same type
        await Vote.findByIdAndDelete(existingVote._id);
        question.votes += voteType === 'up' ? -1 : 1;
        
        // Update author reputation
        const change = voteType === 'up' ? -2 : 1;
        await User.findByIdAndUpdate(question.author, { $inc: { reputation: change } });
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        question.votes += voteType === 'up' ? 2 : -2;
        
        // Update author reputation
        const change = voteType === 'up' ? 4 : -4;
        await User.findByIdAndUpdate(question.author, { $inc: { reputation: change } });
      }
    } else {
      // Create new vote
      await Vote.create({
        user: req.user!.id,
        target: id,
        targetType: 'Question',
        voteType
      });
      question.votes += voteType === 'up' ? 1 : -1;
      
      // Update author reputation
      const change = voteType === 'up' ? 2 : -1;
      await User.findByIdAndUpdate(question.author, { $inc: { reputation: change } });
    }

    await question.save();

    res.json({
      success: true,
      votes: question.votes
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
      if (existingVote.voteType === voteType) {
        // Remove vote if same type
        await Vote.findByIdAndDelete(existingVote._id);
        answer.votes += voteType === 'up' ? -1 : 1;
        
        // Update author reputation
        const change = voteType === 'up' ? -5 : 1;
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: change } });
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        answer.votes += voteType === 'up' ? 2 : -2;
        
        // Update author reputation
        const change = voteType === 'up' ? 10 : -10;
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: change } });
      }
    } else {
      // Create new vote
      await Vote.create({
        user: req.user!.id,
        target: id,
        targetType: 'Answer',
        voteType
      });
      answer.votes += voteType === 'up' ? 1 : -1;
      
      // Update author reputation
      const change = voteType === 'up' ? 5 : -1;
      await User.findByIdAndUpdate(answer.author, { $inc: { reputation: change } });
    }

    await answer.save();

    res.json({
      success: true,
      votes: answer.votes
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
