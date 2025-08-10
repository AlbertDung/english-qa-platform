import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  reputation: number;
  role: 'student' | 'teacher' | 'admin';
  savedQuestions: Types.ObjectId[];
  savedAnswers: Types.ObjectId[];
  activityLog: {
    type: 'question_created' | 'answer_created' | 'question_edited' | 'answer_edited' | 'question_deleted' | 'answer_deleted' | 'vote_cast' | 'question_saved' | 'answer_saved';
    targetId: Types.ObjectId;
    targetType: 'question' | 'answer' | 'vote';
    metadata?: any;
    timestamp: Date;
  }[];
  preferences: {
    emailNotifications: boolean;
    categories: string[];
    difficultyLevel: string;
  };
  profile: {
    bio?: string;
    location?: string;
    website?: string;
    learningGoals?: string[];
    nativeLanguage?: string;
    englishLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  reputation: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  savedQuestions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  savedAnswers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  activityLog: [{
    type: {
      type: String,
      enum: ['question_created', 'answer_created', 'question_edited', 'answer_edited', 'question_deleted', 'answer_deleted', 'vote_cast', 'question_saved', 'answer_saved'],
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    targetType: {
      type: String,
      enum: ['question', 'answer', 'vote'],
      required: true
    },
    metadata: Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    categories: [{
      type: String,
      enum: ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'other']
    }],
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500
    },
    location: {
      type: String,
      maxlength: 100
    },
    website: {
      type: String,
      maxlength: 200
    },
    learningGoals: [{
      type: String,
      maxlength: 100
    }],
    nativeLanguage: {
      type: String,
      maxlength: 50
    },
    englishLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
