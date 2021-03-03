import Joi from 'joi';
import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const user = await req.context.models.User.findOne({ email: req.body.email });
  console.log({ user });
  if (!user) return res.status(400).json('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log({ validPassword });
  if (!validPassword) return res.status(400).json('Invalid email or password');

  res.json(true);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().min(8).max(255),
  });
  return schema.validate(user);
}

export default router;
