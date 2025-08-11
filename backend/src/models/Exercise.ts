import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IExercise extends Document {
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
  topic: string;
  context?: string;
  author: Types.ObjectId;
  isPublic: boolean;
  tags: string[];
  usageCount: number;
  averageScore: number;
  totalAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>({
  type: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'fill-in-blank', 'sentence-correction', 'vocabulary', 'grammar', 'pronunciation']
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  category: {
    type: String,
    required: true,
    enum: ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other']
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  context: {
    type: String,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  usageCount: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
exerciseSchema.index({ type: 1, difficulty: 1, category: 1 });
exerciseSchema.index({ topic: 1, tags: 1 });
exerciseSchema.index({ author: 1, createdAt: -1 });
exerciseSchema.index({ isPublic: 1, usageCount: -1 });
exerciseSchema.index({ averageScore: -1, totalAttempts: -1 });

// Text index for search functionality
exerciseSchema.index({ question: 'text', explanation: 'text', topic: 'text' });

export default mongoose.model<IExercise>('Exercise', exerciseSchema);
