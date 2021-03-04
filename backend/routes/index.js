import express from 'express';
import auth from '../middleware/auth.js';
import * as indexController from '../controllers/indexController.js';

const router = express.Router();

// What is the index route here? There's no obvious resource
// router.get('/', (req, res) => {});

router.get('/me', auth, indexController.me);
router.post('/login', indexController.login);

export default router;
