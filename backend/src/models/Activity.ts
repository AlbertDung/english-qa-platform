import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IActivity extends Document {
  user: Types.ObjectId;
  type: 'question_created' | 'answer_created' | 'question_edited' | 'answer_edited' | 'question_deleted' | 'answer_deleted' | 'vote_cast' | 'question_saved' | 'answer_saved' | 'question_unsaved' | 'answer_unsaved' | 'exercise_created' | 'exercise_completed';
  targetId: Types.ObjectId;
  targetType: 'question' | 'answer' | 'vote' | 'exercise';
  metadata?: {
    title?: string;
    previousTitle?: string;
    voteType?: 'up' | 'down';
    editReason?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'question_created',
      'answer_created', 
      'question_edited',
      'answer_edited',
      'question_deleted',
      'answer_deleted',
      'vote_cast',
      'question_saved',
      'answer_saved',
      'question_unsaved',
      'answer_unsaved',
      'exercise_created',
      'exercise_completed'
    ],
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['question', 'answer', 'vote', 'exercise'],
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ targetId: 1, targetType: 1 });
activitySchema.index({ type: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', activitySchema);
