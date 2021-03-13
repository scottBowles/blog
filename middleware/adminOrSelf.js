export default function (req, res, next) {
  const isLoggedInUser = req.user?._id === req.params.userid;
  if (isLoggedInUser || req.user?.isAdmin) return next();
  return res.status(403).json(`Forbidden: Cannot delete another user's data`);
}
