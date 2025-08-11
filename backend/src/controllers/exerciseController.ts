import { Response } from 'express';
import Exercise from '../models/Exercise';
import { AuthRequest } from '../middleware/auth';
import AIService, { ExerciseRequest, ExerciseSet } from '../services/aiService';
import Activity from '../models/Activity';

export const generateExercises = async (req: AuthRequest, res: Response) => {
  try {
    const { topic, difficulty, exerciseType, count, context, categories } = req.body;

    // Validate request
    if (!topic || !difficulty || !exerciseType || !count) {
      return res.status(400).json({ 
        success: false, 
        message: 'Topic, difficulty, exercise type, and count are required' 
      });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ 
        success: false, 
        message: 'Count must be between 1 and 20' 
      });
    }

    // Generate exercises using AI
    const exerciseSet = await AIService.generateExercises({
      topic,
      difficulty,
      exerciseType,
      count,
      context,
      categories
    });

    // Save exercises to database
    const savedExercises = await Promise.all(
      exerciseSet.exercises.map(async (exercise) => {
        // Ensure category is valid before saving
        const validCategories = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'];
        if (!validCategories.includes(exercise.category)) {
          exercise.category = 'grammar'; // Default to grammar if invalid
        }
        
        const newExercise = new Exercise({
          ...exercise,
          author: req.user!._id,
          tags: [topic, difficulty, exerciseType, ...(categories || [])]
        });
        return await newExercise.save();
      })
    );

    // Log activity
    const activity = new Activity({
      user: req.user!._id,
      type: 'exercise_created',
      targetId: savedExercises[0]._id,
      targetType: 'exercise',
      metadata: {
        topic,
        difficulty,
        exerciseType,
        count: savedExercises.length,
        categories
      }
    });
    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Exercises generated successfully',
      data: {
        exercises: savedExercises,
        metadata: exerciseSet.metadata
      }
    });
  } catch (error: any) {
    console.error('Exercise generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate exercises' 
    });
  }
};

export const generateExercisesFromContent = async (req: AuthRequest, res: Response) => {
  try {
    const { content, difficulty, exerciseType, count, categories } = req.body;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content is required' 
      });
    }

    // Generate exercises based on content
    const exerciseSet = await AIService.generateExercisesFromContent(content, {
      difficulty,
      exerciseType,
      count,
      categories
    });

    // Save exercises to database
    const savedExercises = await Promise.all(
      exerciseSet.exercises.map(async (exercise) => {
        // Ensure category is valid before saving
        const validCategories = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'];
        if (!validCategories.includes(exercise.category)) {
          exercise.category = 'grammar'; // Default to grammar if invalid
        }
        
        const newExercise = new Exercise({
          ...exercise,
          author: req.user!._id,
          context: content,
          tags: [exercise.topic, exercise.difficulty, exercise.type, ...(categories || [])]
        });
        return await newExercise.save();
      })
    );

    // Log activity
    const activity = new Activity({
      user: req.user!._id,
      type: 'exercise_created',
      targetId: savedExercises[0]._id,
      targetType: 'exercise',
      metadata: {
        topic: 'Content-based exercises',
        difficulty: difficulty || 'intermediate',
        exerciseType: exerciseType || 'multiple-choice',
        count: savedExercises.length,
        categories
      }
    });
    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Content-based exercises generated successfully',
      data: {
        exercises: savedExercises,
        metadata: exerciseSet.metadata
      }
    });
  } catch (error: any) {
    console.error('Content-based exercise generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate exercises from content' 
    });
  }
};

export const generatePersonalizedExercises = async (req: AuthRequest, res: Response) => {
  try {
    const { difficulty, exerciseType, count, categories } = req.body;

    // Get user profile for personalization
    const userProfile = {
      englishLevel: req.user!.profile?.englishLevel || 'beginner',
      weakAreas: req.user!.preferences?.categories || ['grammar'],
      preferredCategories: req.user!.preferences?.categories || ['grammar'],
      recentTopics: [] // This could be enhanced to track recent topics
    };

    // Generate personalized exercises
    const exerciseSet = await AIService.generatePersonalizedExercises({
      difficulty,
      exerciseType,
      count,
      categories
    });

    // Save exercises to database
    const savedExercises = await Promise.all(
      exerciseSet.exercises.map(async (exercise) => {
        // Ensure category is valid before saving
        const validCategories = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'];
        if (!validCategories.includes(exercise.category)) {
          exercise.category = 'grammar'; // Default to grammar if invalid
        }
        
        const newExercise = new Exercise({
          ...exercise,
          author: req.user!._id,
          tags: [exercise.topic, exercise.difficulty, exercise.type, ...(categories || [])]
        });
        return await newExercise.save();
      })
    );

    // Log activity
    const activity = new Activity({
      user: req.user!._id,
      type: 'exercise_created',
      targetId: savedExercises[0]._id,
      targetType: 'exercise',
      metadata: {
        topic: 'Personalized exercises',
        difficulty: difficulty || userProfile.englishLevel,
        exerciseType: exerciseType || 'multiple-choice',
        count: savedExercises.length,
        categories
      }
    });
    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Personalized exercises generated successfully',
      data: {
        exercises: savedExercises,
        metadata: exerciseSet.metadata
      }
    });
  } catch (error: any) {
    console.error('Personalized exercise generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate personalized exercises' 
    });
  }
};

export const getExercises = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      difficulty,
      category,
      topic,
      search,
      sort = 'newest'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { isPublic: true };
    
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (topic) filter.topic = { $regex: topic, $options: 'i' };
    
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
      case 'popular':
        sortOption = { usageCount: -1, createdAt: -1 };
        break;
      case 'difficulty':
        sortOption = { difficulty: 1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const exercises = await Exercise.find(filter)
      .populate('author', 'username avatar reputation')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Exercise.countDocuments(filter);

    res.json({
      success: true,
      data: {
        exercises,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('Get exercises error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get exercises' 
    });
  }
};

export const getExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findById(id)
      .populate('author', 'username avatar reputation');

    if (!exercise) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exercise not found' 
      });
    }

    // Increment usage count
    exercise.usageCount += 1;
    await exercise.save();

    res.json({
      success: true,
      data: exercise
    });
  } catch (error: any) {
    console.error('Get exercise error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get exercise' 
    });
  }
};

export const getUserExercises = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user!._id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const exercises = await Exercise.find({ author: userId })
      .populate('author', 'username avatar reputation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Exercise.countDocuments({ author: userId });

    res.json({
      success: true,
      data: {
        exercises,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('Get user exercises error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get user exercises' 
    });
  }
};

export const updateExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exercise not found' 
      });
    }

    // Check if user is the author or has edit permissions
    if (exercise.author.toString() !== req.user!._id.toString() && 
        req.user!.role !== 'admin' && 
        req.user!.role !== 'teacher') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this exercise' 
      });
    }

    // Update exercise
    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: 'Exercise updated successfully',
      data: updatedExercise
    });
  } catch (error: any) {
    console.error('Update exercise error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update exercise' 
    });
  }
};

export const deleteExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exercise not found' 
      });
    }

    // Check if user is the author or admin
    if (exercise.author.toString() !== req.user!._id.toString() && 
        req.user!.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this exercise' 
      });
    }

    await Exercise.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete exercise' 
    });
  }
};

export const submitExerciseAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { answer, timeSpent } = req.body;

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exercise not found' 
      });
    }

    // Check if answer is correct
    const isCorrect = answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    
    // Update exercise statistics
    exercise.totalAttempts += 1;
    
    if (isCorrect) {
      // Calculate new average score (assuming score is 0-100)
      const score = 100;
      const newTotal = (exercise.averageScore * (exercise.totalAttempts - 1)) + score;
      exercise.averageScore = newTotal / exercise.totalAttempts;
    }

    await exercise.save();

    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
        score: isCorrect ? 100 : 0
      }
    });
  } catch (error: any) {
    console.error('Submit exercise answer error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit answer' 
    });
  }
};
