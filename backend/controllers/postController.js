export function postsGet(req, res, next) {
  return res.json({ msg: 'posts_get' });
}

export function postsPost(req, res, next) {
  return res.json({ msg: 'posts_post' });
}

export function postGet(req, res, next) {
  return res.json({ msg: 'post_get' });
}

export function postPut(req, res, next) {
  return res.json({ msg: 'post_put' });
}

export function postDelete(req, res, next) {
  return res.json({ msg: 'post_delete' });
}

export function postCommentsGet(req, res, next) {
  return res.json({ msg: 'post_comments_get' });
}

export function postCommentsPost(req, res, next) {
  return res.json({ msg: 'post_comments_post' });
}

export function postCommentGet(req, res, next) {
  return res.json({ msg: 'post_comment_get' });
}

export function postCommentPut(req, res, next) {
  return res.json({ msg: 'post_comment_put' });
}

export function postCommentDelete(req, res, next) {
  return res.json({ msg: 'post_comment_delete' });
}
