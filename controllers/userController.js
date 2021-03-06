import _ from 'lodash';
import bcrypt from 'bcrypt';

export async function usersGet(req, res, next) {
  /** Get query strings and convert to numbers */
  const limit = Number(req.query.limit);
  const skip = Number(req.query.skip);

  /** Get users from db */
  const users = await req.context.models.User.find()
    .select('-password')
    .limit(limit)
    .skip(skip);

  return res.json(users);
}

export async function usersPost(req, res, next) {
  const { firstName, lastName, email } = req.body;

  const existingUser = await req.context.models.User.findOne({ email });
  if (existingUser) return res.status(400).json('User already registered');

  // Hash the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  const user = await req.context.models.User.create({
    firstName,
    lastName,
    email,
    password: hashed,
  });

  const token = user.generateAuthToken();

  return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .json(_.pick(user, ['_id', 'firstName', 'lastName', 'email', 'fullName']));
}

export async function userGet(req, res, next) {
  const user = await req.context.models.User.findById(req.params.userid).select(
    '-password'
  );
  if (!user) return res.status(404).json('User not found');

  return res.json(user);
}

export async function userPut(req, res, next) {
  /** Ensure email is still unique */
  const userWithGivenEmail = await req.context.models.User.findOne({
    email: req.body.email,
    _id: { $ne: req.params.userid },
  });
  if (userWithGivenEmail) return res.status(400).json('Email already in use');

  /** Get user from db */
  const user = await req.context.models.User.findById(req.params.userid);
  if (!user) return res.status(404).json('User not found');

  /** Salt and hash password */
  let salt;
  let hashed;
  if (req.body.password) {
    salt = await bcrypt.genSalt(10);
    hashed = await bcrypt.hash(req.body.password, salt);
  }

  /** Update user and save */
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;
  user.password = hashed || user.password;
  const updatedUser = await user.save();

  return res.json(
    _.pick(updatedUser, ['_id', 'firstName', 'lastName', 'email', 'fullName'])
  );
}

export async function userDelete(req, res, next) {
  /** Get user from db and remove */
  const user = await req.context.models.User.findById(req.params.userid).select(
    '-password'
  );
  if (user) await user.remove();

  return res.json(user);
}

export async function userPostsGet(req, res, next) {
  /** Get query strings and convert to numbers */
  const limit = Number(req.query.limit);
  const skip = Number(req.query.skip);

  /** Define query filter */
  const filter = { user: req.params.userid };

  /**
   * If no logged in user, or if user is neither admin nor author, filter to
   * return only published posts.
   */
  const userIsAdmin = req.user?.isAdmin;
  const userIsAuthor = req.user?._id === req.params.userid;
  if (!(userIsAdmin || userIsAuthor)) filter.isPublished = true;

  /** Get posts from db */
  const posts = await req.context.models.Post.find(filter)
    .limit(limit)
    .skip(skip);

  return res.json(posts);
}
