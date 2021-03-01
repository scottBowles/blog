import express from 'express';

import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.usersGet);
router.post('/', userController.usersPost);

router.get('/:userid', userController.userGet);
router.put('/:userid', userController.userPut);
router.delete('/:userid', userController.userDelete);

router.get('/:userid/posts', userController.userPostsGet);
router.post('/:userid/posts', userController.userPostsPost);

router.get('/:userid/posts/:postid', userController.userPostGet);
router.put('/:userid/posts/:postid', userController.userPostPut);
router.delete('/:userid/posts/:postid', userController.userPostDelete);

export default router;
