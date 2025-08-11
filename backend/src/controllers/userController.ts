import { Request, Response } from 'express';
import Question from '../models/Question';
import Answer from '../models/Answer';
import User, { IUser } from '../models/User';
import Activity from '../models/Activity';
import SavedContent from '../models/SavedContent';
import { deleteFromCloudinary } from '../services/cloudinaryService';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Get user's questions
export const getUserQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let filter: any = { author: userId };
    
    if (status === 'answered') {
      filter.acceptedAnswer = { $exists: true };
    } else if (status === 'unanswered') {
      filter.acceptedAnswer = { $exists: false };
    }

    const questions = await Question.find(filter)
      .populate('author', 'username avatar reputation')
      .populate('acceptedAnswer')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Question.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        questions,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalQuestions: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    console.error('Get user questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user questions',
      error: error.message
    });
  }
};

// Get user's answers
export const getUserAnswers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let filter: any = { author: userId };
    
    if (status === 'accepted') {
      filter.isAccepted = true;
    }

    const answers = await Answer.find(filter)
      .populate('author', 'username avatar reputation')
      .populate('question', 'title category difficulty')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Answer.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        answers,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalAnswers: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    console.error('Get user answers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user answers',
      error: error.message
    });
  }
};

// Delete user's question
export const deleteUserQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { questionId } = req.params;
    const userId = req.user?._id;

    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns the question or is admin
    if (question.author.toString() !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    // Delete associated attachments from Cloudinary
    if (question.attachments && question.attachments.length > 0) {
      for (const attachment of question.attachments) {
        try {
          await deleteFromCloudinary(attachment.publicId, 'auto');
        } catch (error) {
          console.error('Failed to delete attachment:', error);
        }
      }
    }

    // Delete all answers to this question
    const answers = await Answer.find({ question: questionId });
    for (const answer of answers) {
      // Delete answer attachments
      if (answer.attachments && answer.attachments.length > 0) {
        for (const attachment of answer.attachments) {
          try {
            await deleteFromCloudinary(attachment.publicId, 'auto');
          } catch (error) {
            console.error('Failed to delete answer attachment:', error);
          }
        }
      }
    }
    await Answer.deleteMany({ question: questionId });

    // Remove from saved content
    await SavedContent.deleteMany({ contentId: questionId, contentType: 'question' });

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    // Log activity
    const activity = new Activity({
      user: userId,
      type: 'question_deleted',
      targetId: questionId,
      targetType: 'question',
      metadata: {
        title: question.title
      }
    });
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};

// Delete user's answer
export const deleteUserAnswer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { answerId } = req.params;
    const userId = req.user?._id;

    const answer = await Answer.findById(answerId);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user owns the answer or is admin
    if (answer.author.toString() !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this answer'
      });
    }

    // Delete associated attachments from Cloudinary
    if (answer.attachments && answer.attachments.length > 0) {
      for (const attachment of answer.attachments) {
        try {
          await deleteFromCloudinary(attachment.publicId, 'auto');
        } catch (error) {
          console.error('Failed to delete attachment:', error);
        }
      }
    }

    // Remove from question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answerId }
    });

    // Remove from saved content
    await SavedContent.deleteMany({ contentId: answerId, contentType: 'answer' });

    // Delete the answer
    await Answer.findByIdAndDelete(answerId);

    // Log activity
    const activity = new Activity({
      user: userId,
      type: 'answer_deleted',
      targetId: answerId,
      targetType: 'answer',
      metadata: {
        questionId: answer.question
      }
    });
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete answer',
      error: error.message
    });
  }
};

// Save content (question or answer)
export const saveContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentId, contentType, tags, notes } = req.body;
    const userId = req.user?._id;

    if (!contentId || !contentType) {
      return res.status(400).json({
        success: false,
        message: 'Content ID and type are required'
      });
    }

    if (!['question', 'answer'].includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: 'Content type must be either "question" or "answer"'
      });
    }

    // Check if content exists
    let content;
    if (contentType === 'question') {
      content = await Question.findById(contentId);
    } else {
      content = await Answer.findById(contentId);
    }
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: `${contentType} not found`
      });
    }

    // Check if already saved
    const existingSaved = await SavedContent.findOne({
      user: userId,
      contentId,
      contentType
    });

    if (existingSaved) {
      return res.status(400).json({
        success: false,
        message: `${contentType} already saved`
      });
    }

    // Save content
    const savedContent = new SavedContent({
      user: userId,
      contentId,
      contentType,
      tags: tags || [],
      notes: notes || ''
    });

    await savedContent.save();

    // Log activity
    const activity = new Activity({
      user: userId,
      type: `${contentType}_saved` as any,
      targetId: contentId,
      targetType: contentType,
      metadata: {
        title: (content as any).title || 'Answer'
      }
    });
    await activity.save();

    res.status(200).json({
      success: true,
      message: `${contentType} saved successfully`,
      data: savedContent
    });
  } catch (error: any) {
    console.error('Save content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save content',
      error: error.message
    });
  }
};

// Unsave content
export const unsaveContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentId, contentType } = req.body;
    const userId = req.user?._id;

    const savedContent = await SavedContent.findOneAndDelete({
      user: userId,
      contentId,
      contentType
    });

    if (!savedContent) {
      return res.status(404).json({
        success: false,
        message: 'Saved content not found'
      });
    }

    // Log activity
    const activity = new Activity({
      user: userId,
      type: `${contentType}_unsaved` as any,
      targetId: contentId,
      targetType: contentType,
      metadata: {}
    });
    await activity.save();

    res.status(200).json({
      success: true,
      message: `${contentType} unsaved successfully`
    });
  } catch (error: any) {
    console.error('Unsave content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsave content',
      error: error.message
    });
  }
};

// Get saved content
export const getSavedContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { type, page = 1, limit = 10, tags } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let filter: any = { user: userId };
    
    if (type && ['question', 'answer'].includes(type as string)) {
      filter.contentType = type;
    }

    if (tags) {
      const tagArray = (tags as string).split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    const savedContent = await SavedContent.find(filter)
      .populate({
        path: 'contentId',
        populate: [
          {
            path: 'author',
            select: 'username avatar reputation'
          }
        ]
      })
      .sort({ savedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Manually populate the content based on contentType
    const populatedSavedContent = await Promise.all(
      savedContent.map(async (item) => {
        let populatedContent;
        if (item.contentType === 'question') {
          populatedContent = await Question.findById(item.contentId)
            .populate('author', 'username avatar reputation');
        } else if (item.contentType === 'answer') {
          populatedContent = await Answer.findById(item.contentId)
            .populate('author', 'username avatar reputation');
        }
        
        return {
          ...item.toObject(),
          populatedContent
        };
      })
    );

    const total = await SavedContent.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        savedContent: populatedSavedContent,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    console.error('Get saved content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved content',
      error: error.message
    });
  }
};

// Get user activity
export const getUserActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const { page = 1, limit = 20, type } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let filter: any = { user: userId };
    
    if (type) {
      filter.type = type;
    }

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Activity.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalActivities: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user activity',
      error: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { profile, preferences } = req.body;

    const updateData: any = {};
    
    if (profile) {
      updateData.profile = profile;
    }
    
    if (preferences) {
      updateData.preferences = preferences;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
