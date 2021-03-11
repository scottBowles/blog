import express from 'express';
import Joi from 'joi';
import auth from '../middleware/auth.js';
import * as indexController from '../controllers/indexController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().min(8).max(255),
  });
  return schema.validate(user);
}

// What is the index route here? There's no obvious resource
// router.get('/', (req, res) => {});

router.get('/me', auth, indexController.me);
router.post('/login', validate(validateLogin), indexController.login);

export default router;
