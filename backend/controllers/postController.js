export async function postsGet(req, res, next) {
  const posts = await req.context.models.Post.find();
  return res.json(posts);
}

export async function postGet(req, res, next) {
  const post = await req.context.models.Post.findById(req.params.postid);
  return res.json(post);
}

export async function postPut(req, res, next) {
  const post = await req.context.models.Post.findById(req.params.postid);
  post.title = req.body.title;
  post.text = req.body.text;
  post.isPublished = req.body.isPublished;
  const updatedPost = await post.save();
  return res.json(updatedPost);
}

export async function postDelete(req, res, next) {
  const post = await req.context.models.Post.findById(req.params.postid);
  if (post) await post.remove();
  return res.json(post);
}

export async function postCommentsGet(req, res, next) {
  const { postid } = req.params;
  const comments = await req.context.models.Comment.find({ post: postid });
  return res.json(comments);
}

export async function postCommentsPost(req, res, next) {
  const { text, author, email } = req.body;
  const comment = await req.context.models.Comment.create({
    text,
    author,
    email,
    post: req.params.postid,
  });
  return res.json(comment);
}

export async function postCommentGet(req, res, next) {
  const { commentid } = req.params;
  const comment = await req.context.models.Comment.findById(commentid);
  return res.json(comment);
}

export async function postCommentPut(req, res, next) {
  const { text, author, email } = req.body;
  const { commentid } = req.params;
  const comment = await req.context.models.Comment.findById(commentid);
  comment.text = text;
  comment.author = author;
  comment.email = email;
  const updatedComment = await comment.save();
  return res.json(updatedComment);
}

export async function postCommentDelete(req, res, next) {
  const { commentid } = req.params;
  const comment = await req.context.models.Comment.findById(commentid);
  if (comment) comment.remove();
  return res.json(comment);
}
