import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVote extends Document {
  user: Types.ObjectId;
  target: Types.ObjectId;
  targetType: 'Question' | 'Answer';
  voteType: 'up' | 'down';
  createdAt: Date;
}

const voteSchema = new Schema<IVote>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Question', 'Answer']
  },
  voteType: {
    type: String,
    required: true,
    enum: ['up', 'down']
  }
}, {
  timestamps: true
});

// Ensure one vote per user per target
voteSchema.index({ user: 1, target: 1 }, { unique: true });

export default mongoose.model<IVote>('Vote', voteSchema);
