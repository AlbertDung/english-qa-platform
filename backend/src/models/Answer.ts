import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAnswer extends Document {
  content: string;
  author: Types.ObjectId;
  question: Types.ObjectId;
  votes: number;
  isAccepted: boolean;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    minlength: [10, 'Answer must be at least 10 characters long']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  aiGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnswer>('Answer', answerSchema);
