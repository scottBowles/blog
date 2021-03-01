import mongoose from 'mongoose';
import Joi from 'joi';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 1, maxlength: 255 },
  lastName: { type: String, required: true, minlength: 1, maxlength: 255 },
  email: { type: String, unique: true },
  password: { type: String, minlength: 8, maxlength: 255 },
});

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model('User', UserSchema);

export function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).max(255).required(),
    lastName: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().max(255),
    password: Joi.string().min(8).max(255),
  });
  return schema.validate(user);
}

export default { User, validateUser };
