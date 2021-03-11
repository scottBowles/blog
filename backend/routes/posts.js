import express from 'express';
import * as postController from '../controllers/postController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import validate from '../middleware/validate.js';
import validateObjectId from '../middleware/validateObjectId';
import { validatePost } from '../models/post';
import { validateComment } from '../models/comment.js';

const router = express.Router();

router.get('/', postController.postsGet);
router.post(
  '/',
  auth,
  validate(validatePost, (req) => ({ ...req.body, user: req.user._id })),
  postController.postsPost
);

router.get('/:postid', validateObjectId('postid'), postController.postGet);
router.put(
  '/:postid',
  auth,
  validateObjectId('postid'),
  validate(validatePost, (req) => ({
    ...req.body,
    user: req.body.user || req.user._id,
  })),
  postController.postPut
);
router.delete(
  '/:postid',
  auth,
  validateObjectId('postid'),
  postController.postDelete
);

router.get(
  '/:postid/comments',
  validateObjectId('postid'),
  postController.postCommentsGet
);
router.post(
  '/:postid/comments',
  validateObjectId('postid'),
  validate(validateComment, (req) => ({
    ...req.body,
    post: req.params.postid,
  })),
  postController.postCommentsPost
);

router.get(
  '/:postid/comments/:commentid',
  validateObjectId('postid'),
  validateObjectId('commentid'),
  postController.postCommentGet
);
router.put(
  '/:postid/comments/:commentid',
  auth,
  admin,
  validateObjectId('postid'),
  validateObjectId('commentid'),
  validate(validateComment, (req) => ({
    ...req.body,
    post: req.params.postid,
  })),
  postController.postCommentPut
);
router.delete(
  '/:postid/comments/:commentid',
  auth,
  validateObjectId('postid'),
  validateObjectId('commentid'),
  postController.postCommentDelete
);

export default router;
