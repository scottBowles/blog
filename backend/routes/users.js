import express from 'express';

import * as userController from '../controllers/userController.js';
import protectedRoute from '../middleware/protectedRoute.js';
import adminOrSelf from '../middleware/adminOrSelf.js';
import validate from '../middleware/validate.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { validateUser } from '../models/user.js';

const router = express.Router();

router.get('/', userController.usersGet);
router.post('/', validate(validateUser), userController.usersPost);

router.get('/:userid', validateObjectId('userid'), userController.userGet);
router.put(
  '/:userid',
  [
    validateObjectId('userid'),
    protectedRoute,
    validate(validateUser),
    adminOrSelf,
  ],
  userController.userPut
);
router.delete(
  '/:userid',
  validateObjectId('userid'),
  protectedRoute,
  adminOrSelf,
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
