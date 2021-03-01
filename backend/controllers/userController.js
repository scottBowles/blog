export function usersGet(req, res, next) {
  return res.json({ msg: 'users' });
}

export function usersPost(req, res, next) {
  return res.json({ msg: 'users_post' });
}

export function userGet(req, res, next) {
  return res.json({ msg: 'user_get' });
}

export function userPut(req, res, next) {
  return res.json({ msg: 'user_put' });
}

export function userDelete(req, res, next) {
  return res.json({ msg: 'user_delete' });
}

export function userPostsGet(req, res, next) {
  return res.json({ msg: 'user_posts_get' });
}

export function userPostsPost(req, res, next) {
  return res.json({ msg: 'user_posts_post' });
}

export function userPostGet(req, res, next) {
  return res.json({ msg: 'user_post_get' });
}

export function userPostPut(req, res, next) {
  return res.json({ msg: 'user_post_put' });
}

export function userPostDelete(req, res, next) {
  return res.json({ msg: 'user_post_delete' });
}
