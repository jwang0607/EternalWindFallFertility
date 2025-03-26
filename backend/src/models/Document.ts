import mongoose, { Document, Schema } from 'mongoose';

// Define the Document interface
export interface IDocument extends Document {
  customerId: string;
  title: string;
  type: 'contract' | 'agreement' | 'consent' | 'report' | 'other';
  fileUrl: string;
  status: 'draft' | 'pending' | 'signed' | 'expired';
  signingUrl?: string;
  signedDate?: Date;
  expiryDate?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Document Schema
const DocumentSchema: Schema = new Schema(
  {
    customerId: {
      type: String,
      required: [true, 'Customer ID is required'],
      ref: 'Customer'
    },
    title: {
      type: String,
      required: [true, 'Document title is required']
    },
    type: {
      type: String,
      required: [true, 'Document type is required'],
      enum: ['contract', 'agreement', 'consent', 'report', 'other']
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required']
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'signed', 'expired'],
      default: 'draft'
    },
    signingUrl: {
      type: String
    },
    signedDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Create an index on customerId for faster queries
DocumentSchema.index({ customerId: 1 });

export default mongoose.model<IDocument>('Document', DocumentSchema); 