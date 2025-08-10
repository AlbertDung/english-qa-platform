import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAnswer extends Document {
  content: string;
  author: Types.ObjectId;
  question: Types.ObjectId;
  votes: number;
  isAccepted: boolean;
  aiGenerated: boolean;
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
  },
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
      ref: 'User',
      required: true
    },
    previousContent: {
      type: String,
      required: true
    },
    editReason: {
      type: String,
      maxlength: 200
    }
  }],
  lastEditedAt: {
    type: Date
  },
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnswer>('Answer', answerSchema);
