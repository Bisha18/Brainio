import mongoose, { Schema } from "mongoose";

const ContentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  // ✅ Renamed from 'UserId' to 'userId' for camelCase convention
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Content = mongoose.model('Content', ContentSchema);
export default Content;