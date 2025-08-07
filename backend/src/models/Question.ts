import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: string[];
  author: Types.ObjectId;
  votes: number;
  viewCount: number;
  answers: Types.ObjectId[];
  acceptedAnswer?: Types.ObjectId;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'writing' | 'speaking' | 'reading' | 'listening' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Question content is required'],
    minlength: [20, 'Content must be at least 20 characters long']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  acceptedAnswer: {
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  category: {
    type: String,
    enum: ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'other'],
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ category: 1, difficulty: 1, createdAt: -1 });

export default mongoose.model<IQuestion>('Question', questionSchema);
