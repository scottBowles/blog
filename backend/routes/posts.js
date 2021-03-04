import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.get('/', postController.postsGet);
router.post('/', auth, postController.postsPost);

router.get('/:postid', postController.postGet);
router.put('/:postid', auth, postController.postPut);
router.delete('/:postid', auth, postController.postDelete);

router.get('/:postid/comments', postController.postCommentsGet);
router.post('/:postid/comments', postController.postCommentsPost);

router.get('/:postid/comments/:commentid', postController.postCommentGet);
router.put(
  '/:postid/comments/:commentid',
  auth,
  admin,
  postController.postCommentPut
);
router.delete(
  '/:postid/comments/:commentid',
  auth,
  postController.postCommentDelete
);

export default router;
