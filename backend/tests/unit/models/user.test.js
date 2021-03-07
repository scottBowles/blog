import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import _ from 'lodash';
import dotenv from 'dotenv';
import { User } from '../../../models/user.js';

dotenv.config();

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      firstName: 'testUserFirst',
      lastName: 'testUserLast',
      email: 'testUser@email.com',
      password: 'testUserPassword',
      isAdmin: false,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    expect(decoded).toMatchObject(_.pick(payload, ['_id', 'isAdmin']));
  });
});
