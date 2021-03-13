export default function (req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json('Access denied');
  next();
}
