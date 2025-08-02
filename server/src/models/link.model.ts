import mongoose, { Schema, Document } from "mongoose";

// Best practice: Define an interface for your document
export interface ILink extends Document {
  hash: string;
  userId: mongoose.Types.ObjectId;
}

const linkSchema = new Schema<ILink>({
  hash: {
    type: String,
    required: true,
    unique: true // Hash must be unique to be a reliable lookup key
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // This enforces a one-to-one relationship: one user can have only one share link
  }
}, { timestamps: true });

const Link = mongoose.model<ILink>('Link', linkSchema);
export default Link;