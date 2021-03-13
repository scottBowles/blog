import bcrypt from 'bcrypt';

export async function me(req, res, next) {
  /** Get user from db, excluding password */
  const user = await req.context.models.User.findById(req.user._id).select(
    '-password'
  );
  if (!user) return res.status(404).json('User not found');

  return res.json(user);
}

export async function login(req, res, next) {
  /** Fetch user */
  const user = await req.context.models.User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json('Invalid email or password');

  /** Validate password */
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json('Invalid email or password');

  /** Generate jwt and send to client */
  const token = user.generateAuthToken();
  res.json(token);
}
