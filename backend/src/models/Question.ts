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
  categories: string[]; // Changed from single category to multiple categories
  difficultyLevels: string[]; // Changed from single difficulty to multiple difficulty levels
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    publicId: string;
    originalName: string;
  }[];
  editHistory: {
    editedAt: Date;
    editedBy: Types.ObjectId;
    previousContent: string;
    editReason?: string;
  }[];
  lastEditedAt?: Date;
  lastEditedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
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
  categories: [{ // Changed from single category to array
    type: String,
    enum: ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'],
    required: true
  }],
  difficultyLevels: [{ // Changed from single difficulty to array
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    }
  }],
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    previousContent: String,
    editReason: String
  }],
  lastEditedAt: Date,
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Text index for search functionality
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IQuestion>('Question', questionSchema);
