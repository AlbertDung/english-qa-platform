import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISavedContent extends Document {
  user: Types.ObjectId;
  contentId: Types.ObjectId;
  contentType: 'question' | 'answer';
  savedAt: Date;
  tags?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const savedContentSchema = new Schema<ISavedContent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  contentType: {
    type: String,
    enum: ['question', 'answer'],
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index to ensure user can't save the same content twice
savedContentSchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });
savedContentSchema.index({ user: 1, savedAt: -1 });
savedContentSchema.index({ contentType: 1, savedAt: -1 });

export default mongoose.model<ISavedContent>('SavedContent', savedContentSchema);
