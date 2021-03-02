import _ from 'lodash';
import { isValidObjectId } from '../models/utils.js';

export async function postsGet(req, res, next) {
  const posts = await req.context.models.Post.find();
  return res.json(posts);
}

export async function postGet(req, res, next) {
  const { postid } = req.params;

  if (!isValidObjectId(postid)) {
    return res.status(400).json('Invalid postid');
  }

  const post = await req.context.models.Post.findById(postid);
  return res.json(post);
}

export async function postPut(req, res, next) {
  const { postid } = req.params;
  const { value, error } = req.context.validate.post({
    ...req.body,
    post: postid,
  });

  if (error) return res.status(400).send(error.details[0].message);

  const { title, text, isPublished, post } = value;
  const foundPost = await req.context.models.Post.findById(post);
  foundPost.title = title;
  foundPost.text = text;
  foundPost.isPublished = isPublished;
  const updatedPost = await post.save();
  return res.json(updatedPost);
}

export async function postDelete(req, res, next) {
  const { postid } = req.params;

  if (!isValidObjectId(postid)) {
    return res.status(400).json('Invalid postid');
  }

  const post = await req.context.models.Post.findById(postid);
  if (post) await post.remove();
  return res.json(post);
}

export async function postCommentsGet(req, res, next) {
  const { postid } = req.params;

  if (!isValidObjectId(postid)) {
    return res.status(400).json('Invalid postid');
  }

  const comments = await req.context.models.Comment.find({ post: postid });
  return res.json(comments);
}

export async function postCommentsPost(req, res, next) {
  const { value, error } = req.context.validate.comment({
    ...req.body,
    post: req.params.postid,
  });

  if (error) return res.status(400).send(error.details[0].message);

  const comment = await req.context.models.Comment.create(
    _.pick(value, ['text', 'author', 'email', 'post'])
  );
  return res.json(comment);
}

export async function postCommentGet(req, res, next) {
  const { commentid } = req.params;

  if (!isValidObjectId(commentid)) {
    return res.status(400).json('Invalid commentid');
  }

  const comment = await req.context.models.Comment.findById(commentid);
  return res.json(comment);
}

export async function postCommentPut(req, res, next) {
  const { postid, commentid } = req.params;

  const { value, error } = req.context.validate.comment({
    ...req.body,
    post: postid,
  });

  if (!isValidObjectId(commentid))
    return res.status(400).json('Invalid commentid');

  if (error) return res.status(400).send(error.details[0].message);

  const { text, author, email } = value;
  const comment = await req.context.models.Comment.findById(commentid);
  comment.text = text;
  comment.author = author;
  comment.email = email;
  const updatedComment = await comment.save();
  return res.json(updatedComment);
}

export async function postCommentDelete(req, res, next) {
  const { commentid } = req.params;

  if (!isValidObjectId(commentid)) {
    return res.status(400).json('Invalid commentid');
  }

  const comment = await req.context.models.Comment.findById(commentid);
  if (comment) comment.remove();
  return res.json(comment);
}
