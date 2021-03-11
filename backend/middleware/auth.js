import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json('Invalid token');
  }
}
