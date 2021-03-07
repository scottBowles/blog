import _ from 'lodash';
import bcrypt from 'bcrypt';

export async function usersGet(req, res, next) {
  const users = await req.context.models.User.find();
  return res.json(users);
}

export async function usersPost(req, res, next) {
  const { error } = req.context.validate.user(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUser = await req.context.models.User.findOne({
    email: req.body.email,
  });
  if (existingUser) return res.status(400).json('User already registered');

  // Hash the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  const user = await req.context.models.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashed,
  });

  const token = user.generateAuthToken();

  return res
    .header('x-auth-token', token)
    .json(_.pick(user, ['_id', 'firstName', 'lastName', 'email', 'fullName']));
}

export async function userGet(req, res, next) {
  const user = await req.context.models.User.findById(req.params.userid);
  if (!user) return res.status(404).json('User not found');

  return res.json(user);
}

export async function userPut(req, res, next) {
  /** Validate req.body */
  const { error } = req.context.validate.user(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  /** Ensure email is still unique */
  /// /////// NEED TO TEST /////// ///
  const userWithGivenEmail = await req.context.models.User.findOne({
    email: req.body.email,
    _id: { $ne: req.params.userid },
  });
  if (userWithGivenEmail) return res.status(400).json('Email already in use');

  /** Get user from db */
  const user = await req.context.models.User.findById(req.params.userid);
  if (!user) return res.status(404).json('User not found');

  /** Salt and hash password */
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  /** Update user and save */
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = hashed;
  const updatedUser = await user.save();

  return res.json(updatedUser);
}

export async function userDelete(req, res, next) {
  /** Get user from db and remove */
  const user = await req.context.models.User.findById(req.params.userid);
  if (user) await user.remove();

  return res.json(user);
}

export async function userPostsGet(req, res, next) {
  const posts = await req.context.models.Post.find({ user: req.params.userid });
  return res.json(posts);
}
