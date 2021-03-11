export default function auth(req, res, next) {
  if (!req.user)
    return res.status(401).json('Access denied. No token provided.');
  next();
}
