import mongoose from 'mongoose';
import Joi from 'joi';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, minlength: 1, maxlength: 255 },
    text: { type: String, minlength: 1, maxlength: 99999 },
    isPublished: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', PostSchema);

export function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255),
    text: Joi.string().min(1).max(99999),
    isPublished: Joi.boolean,
    // user will come through params
  });
  return schema.validate(post);
}

export default { Post, validatePost };
