import mongoose from 'mongoose';
import Joi from 'joi';

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, minlength: 1, maxlength: 255, required: true },
    author: { type: String, minlength: 1, maxlength: 9999, required: true },
    email: { type: String, minlength: 1, maxlength: 255 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', CommentSchema);

export function validateComment(comment) {
  const schema = Joi.object({
    text: Joi.string().min(1).max(255).required(),
    author: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().max(255),
    post: Joi.objectId().required(),
  });
  return schema.validate(comment);
}

export function validateCommentUpdate(comment) {
  const schema = Joi.object({
    text: Joi.string().min(1).max(255),
    author: Joi.string().min(1).max(255),
    email: Joi.string().email().max(255),
    post: Joi.objectId(),
  });
  return schema.validate(comment);
}
