import mongoose from 'mongoose';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { Post } from '../../models/post.js';
import { User } from '../../models/user.js';
import { Comment } from '../../models/comment.js';
import app from '../../startup/app.js';

let server;

describe('/users', () => {
  beforeEach(() => {
    server = app.listen(process.env.PORT_TEST);
  });
  afterEach(async () => {
    await Post.remove({});
    await User.remove({});
    await Comment.remove({});
    await server.close();
  });

  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        {
          firstName: 'first',
          lastName: 'last',
          email: 'e1@test.com',
          password: 'password',
        },
        {
          firstName: 'first',
          lastName: 'last',
          email: 'e2@test.com',
          password: 'password',
        },
        {
          firstName: 'first',
          lastName: 'last',
          email: 'e3@test.com',
          password: 'password',
        },
      ]);
      const res = await request(server).get('/users');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((u) => u.email === 'e1@test.com')).toBeTruthy();
      expect(res.body.some((u) => u.email === 'e2@test.com')).toBeTruthy();
      expect(res.body.some((u) => u.email === 'e3@test.com')).toBeTruthy();
    });
  });
  describe('POST /', () => {
    let payload;

    const exec = () => request(server).post('/users').send(payload);

    beforeEach(() => {
      payload = {
        firstName: 'first',
        lastName: 'last',
        email: 'e1@test.com',
        password: 'password',
      };
    });

    it(`should return 400 if firstName is less than 1 char`, async () => {
      payload.firstName = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if firstName is more than 255 char`, async () => {
      payload.firstName = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if lastName is less than 1 char`, async () => {
      payload.lastName = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if lastName is more than 255 char`, async () => {
      payload.lastName = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email is more than 255 char`, async () => {
      payload.email = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if no email is provided`, async () => {
      payload.email = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if password is less than 8 char`, async () => {
      payload.password = '1234567';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if password is more than 255 char`, async () => {
      payload.password = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if no password is provided`, async () => {
      payload.password = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email is already in use`, async () => {
      await User.create({
        firstName: 'f',
        lastName: 'l',
        email: payload.email,
        password: '12345678',
      });
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should create the new user in the db`, async () => {
      await exec();
      const user = await User.findOne({ email: payload.email });
      expect(user).toBeDefined();
      expect(user.firstName).toBe(payload.firstName);
      expect(user.lastName).toBe(payload.lastName);
      expect(user.email).toBe(payload.email);
    });

    it(`should return a valid jwt in header`, async () => {
      const res = await exec();
      const token = res.header['x-auth-token'];
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      expect(decoded).toHaveProperty('_id');
    });

    it(`should return the new user with no password value`, async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(
        _.pick(payload, ['firstName', 'lastName', 'email'])
      );
      expect(res.body.password).not.toBeDefined();
    });
  });

  describe('GET /users/:userid', () => {
    let userid;
    let existingUser;

    const exec = () => request(server).get(`/users/${userid}`);

    beforeEach(async () => {
      userid = mongoose.Types.ObjectId();
      existingUser = {
        _id: userid.toHexString(),
        firstName: 'f',
        lastName: 'l',
        email: 'test@email.com',
        password: '12345678',
      };
      await User.create(existingUser);
    });

    it(`should return 400 if userid isn't a valid objectid`, async () => {
      userid = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if user not found`, async () => {
      userid = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return the user`, async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(existingUser);
    });
  });

  describe(`PUT /users/:userid`, () => {
    // validators
    // 401 if no token
    // 400 if invalid token
    // 403 if not admin or self
    // 400 if invalid userid objectid
    // 400 if email already in use by other user
    // 404 if user not found
    // should update user
    // should return updated user with hashed password
  });
});
