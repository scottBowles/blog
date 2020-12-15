const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, minlength: 1, maxlength: 255, required: true },
    author: { type: String, minlength: 1, maxlength: 9999, required: true },
    email: { type: String, minlength: 1, maxlength: 255 },
    post: { type: mongoose.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
