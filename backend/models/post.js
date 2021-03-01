import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, minlength: 1, maxlength: 255 },
    text: { type: String, minlength: 1, maxlength: 99999 },
    isPublished: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);

export default Post;
