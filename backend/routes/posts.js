import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import * as postController from '../controllers/postController.js';
import validateObjectId from '../middleware/validateObjectId';

const router = express.Router();

router.get('/', postController.postsGet);
router.post('/', auth, postController.postsPost);

router.get('/:postid', validateObjectId('postid'), postController.postGet);
router.put(
  '/:postid',
  auth,
  validateObjectId('postid'),
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
