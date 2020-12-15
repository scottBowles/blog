const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    title: { type: String, minlength: 1, maxlength: 255 },
    text: { type: String, minlength: 1, maxlength: 99999 },
    isPublished: { type: Boolean, default: false },
    user: { type: mongoose.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
