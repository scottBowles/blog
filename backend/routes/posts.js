import express from 'express';
import * as postController from '../controllers/postController.js';
import protectedRoute from '../middleware/protectedRoute.js';
import admin from '../middleware/admin.js';
import validate from '../middleware/validate.js';
import validateObjectId from '../middleware/validateObjectId';
import { validatePost } from '../models/post';
import { validateComment } from '../models/comment.js';

const router = express.Router();

router.get('/', postController.postsGet);
router.post(
  '/',
  protectedRoute,
  validate(validatePost, (req) => ({ ...req.body, user: req.user._id })),
  postController.postsPost
);

router.get('/:postid', validateObjectId('postid'), postController.postGet);
router.put(
  '/:postid',
  validateObjectId('postid'),
  protectedRoute,
  validate(validatePost, (req) => ({
    ...req.body,
    user: req.body.user || req.user._id,
  })),
  postController.postPut
);
router.delete(
  '/:postid',
  validateObjectId('postid'),
  protectedRoute,
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
  validateObjectId('postid'),
  validateObjectId('commentid'),
  protectedRoute,
  validate(validateComment, (req) => ({
    ...req.body,
    post: req.params.postid,
  })),
  admin,
  postController.postCommentPut
);
router.delete(
  '/:postid/comments/:commentid',
  validateObjectId('postid'),
  validateObjectId('commentid'),
  protectedRoute,
  postController.postCommentDelete
);

export default router;
