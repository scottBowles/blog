import express from 'express';

import auth from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.usersGet);
router.post('/', userController.usersPost);

router.get('/:userid', userController.userGet);
router.put('/:userid', auth, userController.userPut);
router.delete('/:userid', auth, userController.userDelete);

router.get('/:userid/posts', userController.userPostsGet);

/**
 * POST new posts to '/posts', as logged in user can only post to their own account
 * For individual posts, use their `/post/:postid` uri
 */

export default router;
