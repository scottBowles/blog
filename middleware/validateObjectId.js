import mongoose from 'mongoose';

export default function (idField) {
  return function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params[idField])) {
      return res.status(400).json('Invalid postid');
    }
    next();
  };
}
