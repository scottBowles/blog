import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, minlength: 1, maxlength: 255, required: true },
    author: { type: String, minlength: 1, maxlength: 9999, required: true },
    email: { type: String, minlength: 1, maxlength: 255 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
