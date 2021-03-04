import Joi from 'joi';
import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().min(8).max(255),
  });
  return schema.validate(user);
}

router.post('/', async (req, res) => {
  /** Validate input */
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  /** Fetch user */
  const user = await req.context.models.User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json('Invalid email or password');

  /** Validate password */
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json('Invalid email or password');

  /** Generate jwt and send to client */
  const token = user.generateAuthToken();
  res.json(token);
});

export default router;
