import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import adminOrSelf from '../../../middleware/adminOrSelf.js';

dotenv.config();

describe('admin middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    const id = mongoose.Types.ObjectId();
    req = { user: { _id: id, isAdmin: true }, params: { userid: id } };
    res = { status: jest.fn().mockReturnValue({ json: jest.fn() }) };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 403 if user._id does not match params.userid && !req.user.isAdmin', () => {
    req.user._id = mongoose.Types.ObjectId();
    req.user.isAdmin = false;
    adminOrSelf(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should return 403 if req.user is undefined', () => {
    req.user = undefined;
    adminOrSelf(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call next if req.user._id matches params.userid', () => {
    req.user.isAdmin = false;
    adminOrSelf(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if req.user.isAdmin', () => {
    req.user._id = mongoose.Types.ObjectId();
    req.user.isAdmin = true;
    adminOrSelf(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
