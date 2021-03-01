import { User, validateUser } from './user.js';
import { Post, validatePost } from './post.js';
import { Comment, validateComment } from './comment.js';

export const models = {
  User,
  Post,
  Comment,
};

export const validate = {
  user: validateUser,
  post: validatePost,
  comment: validateComment,
};
