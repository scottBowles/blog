import _ from 'lodash';

export async function postsGet(req, res, next) {
  const posts = await req.context.models.Post.find();
  return res.json(posts);
}

export async function postsPost(req, res, next) {
  const { title, text, isPublished } = req.body;
  /** Create post */
  const post = await req.context.models.Post.create({
    title,
    text,
    isPublished,
    user: req.user._id,
  });

  return res.json(post);
}

export async function postGet(req, res, next) {
  const post = await req.context.models.Post.findById(req.params.postid);
  if (!post) return res.status(404).json('Post not found');
  return res.json(post);
}

export async function postPut(req, res, next) {
  /** Get post from db */
  const post = await req.context.models.Post.findById(req.params.postid);
  if (!post) return res.status(404).send('Post not found');

  /** Ensure post belongs to the logged-in user or user is admin */
  if (req.user._id !== post.user.toString() && !req.user.isAdmin)
    return res.status(403).json(`Forbidden: Cannot update another user's post`);

  /** Update post */
  post.title = req.body.title;
  post.text = req.body.text;
  post.isPublished = req.body.isPublished;
  const updatedPost = await post.save();

  return res.json(updatedPost);
}

export async function postDelete(req, res, next) {
  /** Get post from db */
  const post = await req.context.models.Post.findById(req.params.postid);
  if (!post) return res.status(404).json('Post not found');

  /** Ensure post belongs to the logged-in user or user is admin */
  const isUsersPost = post.user.toString() === req.user._id;
  if (!isUsersPost && !req.user.isAdmin)
    return res.status(403).json(`Forbidden: Cannot remove another user's post`);

  /** Remove post */
  if (post) await post.remove();

  return res.json(post);
}

export async function postCommentsGet(req, res, next) {
  const comments = await req.context.models.Comment.find({
    post: req.params.postid,
  });
  return res.json(comments);
}

export async function postCommentsPost(req, res, next) {
  const { text, author, email } = req.body;

  const post = await req.context.models.Post.findById(req.params.postid);
  if (!post) return res.status(404).json('Post not found');

  const comment = await req.context.models.Comment.create({
    text,
    author,
    email,
    post: req.params.postid,
  });
  return res.json(comment);
}

export async function postCommentGet(req, res, next) {
  const comment = await req.context.models.Comment.findById(
    req.params.commentid
  );
  if (!comment) return res.status(404).json('Comment not found');
  return res.json(comment);
}

export async function postCommentPut(req, res, next) {
  /** Get comment from db */
  const comment = await req.context.models.Comment.findById(
    req.params.commentid
  );
  if (!comment) return res.status(404).json('Comment not found');

  /** Update comment */
  comment.text = req.body.text;
  comment.author = req.body.author;
  comment.email = req.body.email;
  const updatedComment = await comment.save();

  return res.json(updatedComment);
}

export async function postCommentDelete(req, res, next) {
  /** Get post from db */
  const post = await req.context.models.Post.findById(req.params.postid);
  if (!post) return res.status(404).json('Post not found');

  /** Ensure post belongs to logged in user or user is admin */
  const isUsersPost = post.user.toString() === req.user._id;
  if (!isUsersPost && !req.user.isAdmin)
    return res.status(403).json(`Forbidden: Cannot remove comment.`);

  /** Get comment from db */
  const comment = await req.context.models.Comment.findById(
    req.params.commentid
  );

  /** Ensure comment matches post (lest matching post to user is for naught) */
  if (comment && comment.post.toString() !== post._id.toString())
    return res
      .status(400)
      .json('Comment does not belong to the post in provided uri');

  /** Remove comment */
  if (comment) await comment.remove();

  return res.json(comment);
}
