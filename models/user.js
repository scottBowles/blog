import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 1, maxlength: 255 },
    lastName: { type: String, required: true, minlength: 1, maxlength: 255 },
    email: { type: String, required: true, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    isAdmin: Boolean,
  },
  { toJSON: { virtuals: true } }
);

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
};

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model('User', UserSchema);

export function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).max(255).required(),
    lastName: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

export function validateUserUpdate(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).max(255),
    lastName: Joi.string().min(1).max(255),
    email: Joi.string().email().max(255),
    password: Joi.string().min(8).max(255),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

export default { User, validateUser, validateUserUpdate };
