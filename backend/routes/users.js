import express from 'express';

import * as userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import adminOrSelf from '../middleware/adminOrSelf.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/', userController.usersGet);
router.post('/', userController.usersPost);

router.get('/:userid', validateObjectId('userid'), userController.userGet);
router.put(
  '/:userid',
  auth,
  adminOrSelf,
  validateObjectId('userid'),
  userController.userPut
);
router.delete(
  '/:userid',
  auth,
  adminOrSelf,
  validateObjectId('userid'),
  userController.userDelete
);

router.get(
  '/:userid/posts',
  validateObjectId('userid'),
  userController.userPostsGet
);

/**
 * POST new posts to '/posts', as logged in user can only post to their own account
 * For individual posts, use their `/post/:postid` uri
 */

export default router;
