const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 1, maxlength: 255 },
  lastName: { type: String, required: true, minlength: 1, maxlength: 255 },
  email: { type: String, unique: true },
  password: { type: String, minlength: 8, maxlength: 255 },
});

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);
