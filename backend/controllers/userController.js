import _ from 'lodash';
import { isValidObjectId } from '../models/utils.js';

export async function usersGet(req, res, next) {
  const users = await req.context.models.User.find();
  return res.json(users);
}

export async function usersPost(req, res, next) {
  const { value, error } = req.context.validate.user(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await req.context.models.User.create(
    _.pick(value, ['firstName', 'lastName', 'email', 'password'])
  );
  return res.json(user);
}

export async function userGet(req, res, next) {
  if (!isValidObjectId(req.params.userid)) {
    return res.status(400).json('Invalid userid');
  }

  const user = await req.context.models.User.findById(req.params.userid);
  if (!user) return res.status(404).json('User not found');

  return res.json(user);
}

export async function userPut(req, res, next) {
  const { error } = req.context.validate.user({
    ...req.body,
    user: req.params.userid,
  });

  if (error) return res.status(400).send(error.details[0].message);

  const user = await req.context.models.User.findById(req.body.userid);
  if (!user) return res.status(404).json('User not found');

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;

  const updatedUser = await user.save();

  return res.json(updatedUser);
}

export async function userDelete(req, res, next) {
  if (!isValidObjectId(req.params.userid))
    return res.status(400).json('Invalid userid');

  const user = await req.context.models.User.findById(req.params.userid);
  if (user) await user.remove();
  return res.json(user);
}

export async function userPostsGet(req, res, next) {
  if (!isValidObjectId(req.params.userid)) {
    return res.status(400).json('Invalid userid');
  }

  const posts = await req.context.models.Post.find({ user: req.params.userid });
  return res.json(posts);
}

export async function userPostsPost(req, res, next) {
  const { value, error } = req.context.validate.post({
    ...req.body,
    user: req.params.userid,
  });

  if (error) return res.status(400).send(error.details[0].message);

  const post = await req.context.models.Post.create(
    _.pick(value, ['title', 'text', 'isPublished', 'user'])
  );
  return res.json(post);
}
