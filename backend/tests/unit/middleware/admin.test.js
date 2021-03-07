import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import admin from '../../../middleware/admin.js';

dotenv.config();

describe('admin middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: { isAdmin: true } };
    res = { status: jest.fn().mockReturnValue({ json: jest.fn() }) };
    next = jest.fn();
  });

  it('should return 403 if req.user.isAdmin is false', () => {
    req.user.isAdmin = false;
    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should return 403 if req.user is undefined', () => {
    req = {};
    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call next if req.user.isAdmin', () => {
    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
