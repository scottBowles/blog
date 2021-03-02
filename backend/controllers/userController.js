import { isValidObjectId } from '../models/utils.js';

export async function usersGet(req, res, next) {
  const users = await req.context.models.User.find();
  return res.json(users);
}

export async function usersPost(req, res, next) {
  const { value, error } = req.context.validate.user(req.body);
  // handle errors
  const { firstName, lastName, email, password } = value;
  const user = await req.context.models.User.create({
    firstName,
    lastName,
    email,
    password,
  });
  return res.json(user);
}

export async function userGet(req, res, next) {
  if (!isValidObjectId(req.params.userid)) {
    return res.status(400).json('Invalid customer');
  }

  const user = await req.context.models.User.findById(req.params.userid);
  return res.json(user);
}

export async function userPut(req, res, next) {
  const { value, error } = req.context.validate.user({
    ...req.body,
    user: req.params.userid,
  });
  // handle errors
  const user = await req.context.models.User.findById(req.params.userid);

  user.firstName = value.firstName;
  user.lastName = value.lastName;
  user.email = value.email;
  user.password = value.password;

  const updatedUser = await user.save();

  return res.json(updatedUser);
}

export async function userDelete(req, res, next) {
  if (!isValidObjectId(req.params.userid)) {
    return res.status(400).json('Invalid customer');
  }

  const user = await req.context.models.User.findById(req.params.userid);
  if (user) await user.remove();
  return res.json(user);
}

export async function userPostsGet(req, res, next) {
  if (!isValidObjectId(req.params.userid)) {
    return res.status(400).json('Invalid customer');
  }

  const posts = await req.context.models.Post.find({ user: req.params.userid });
  return res.json(posts);
}

export async function userPostsPost(req, res, next) {
  const { value, error } = req.context.validate.post({
    ...req.body,
    user: req.params.userid,
  });

  // handle errors
  const { title, text, isPublished } = value;
  const post = await req.context.models.Post.create({
    title,
    text,
    isPublished,
    user: req.params.userid,
  });
  return res.json(post);
}
