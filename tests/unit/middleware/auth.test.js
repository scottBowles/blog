import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../../../models/user.js';
import auth from '../../../middleware/auth.js';

dotenv.config();

/**
 * NOTE: The auth middleware's execution paths are tested in its integration
 * test. This unit test only checks that the user is added to the request object
 */

describe('auth middleware', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
