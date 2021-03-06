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
    let queryString;

    const exec = () => request(server).get(`/users${queryString}`);

    beforeEach(async () => {
      queryString = '';

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
    });

    it('should return all users excluding the password field', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((u) => u.email === 'e1@test.com')).toBeTruthy();
      expect(res.body.some((u) => u.email === 'e2@test.com')).toBeTruthy();
      expect(res.body.some((u) => u.email === 'e3@test.com')).toBeTruthy();
      expect(res.body.some((u) => u.password)).toBeFalsy();
    });

    it(`should return limit number of users if limit query string is provided`, async () => {
      queryString = '?limit=2';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it(`should skip given number of users if skip query string is provided`, async () => {
      queryString = '?skip=1';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].email).toBe('e2@test.com');
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
      const { password, ...userWithoutPassword } = existingUser;
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(userWithoutPassword);
      expect(res.body.password).not.toBeDefined();
    });
  });

  describe(`PUT /:userid`, () => {
    let userid;
    let token;
    let initialUserPayload;
    let updatePayload;

    const exec = () =>
      request(server)
        .put(`/users/${userid}`)
        .set('x-auth-token', token)
        .send(updatePayload);

    beforeEach(async () => {
      userid = mongoose.Types.ObjectId();
      initialUserPayload = {
        _id: userid,
        firstName: 'f',
        lastName: 'l',
        email: 'e@mail.com',
        password: 'password',
      };

      const user = await User.create(initialUserPayload);

      token = user.generateAuthToken();

      updatePayload = {
        firstName: 'newFirst',
        lastName: 'newLast',
        email: 'new@email.com',
        password: 'newPassword',
      };
    });

    // validateUser tested elsewhere
    it(`should return 400 if userid is an invalid objectid`, async () => {
      userid = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 401 if no jwt is provided`, async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it(`should return 403 if request user is neither an admin nor the user being updated`, async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it(`should return 400 if new email is already in use by another user`, async () => {
      await User.create(updatePayload);
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 404 if user not found`, async () => {
      await User.remove({});
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it(`should update the user with password hashed`, async () => {
      const res = await exec();
      const user = await User.findById(userid);

      expect(res.status).toBe(200);
      expect(user.firstName).toBe(updatePayload.firstName);
      expect(user.email).toBe(updatePayload.email);
      expect(user.password).not.toBe(updatePayload.password);
    });

    it(`should return the updated user without password`, async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('firstName', updatePayload.firstName);
      expect(res.body).not.toHaveProperty('password');
    });

    it(`should work with only a partial payload`, async () => {
      updatePayload = { email: 'new@email.com' };
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'firstName',
        initialUserPayload.firstName
      );
      expect(res.body).toHaveProperty('email', updatePayload.email);
      expect(res.body).not.toHaveProperty('password');
    });
  });

  describe(`DELETE /:userid`, () => {
    let userid;
    let token;
    let userPayload;

    const exec = () =>
      request(server).delete(`/users/${userid}`).set('x-auth-token', token);

    beforeEach(async () => {
      userid = mongoose.Types.ObjectId();

      userPayload = {
        _id: userid.toHexString(),
        firstName: 'f',
        lastName: 'l',
        email: 'e@mail.com',
        password: 'password',
      };

      const user = await User.create(userPayload);

      token = user.generateAuthToken();
    });

    // 403 adminOrSelf middleware tested elsewhere
    it(`should return 400 if userid is invalid objectid`, async () => {
      userid = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 401 if no jwt is provided`, async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it(`should delete the user and return the deleted user`, async () => {
      const res = await exec();
      const noLongerExistingUser = await User.findById(userid);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', userPayload._id);
      expect(res.body).toHaveProperty('firstName', userPayload.firstName);
      expect(res.body).not.toHaveProperty('password');
      expect(noLongerExistingUser).toBeFalsy();
    });

    it(`should not crash if user not found`, async () => {
      await User.remove({});
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toBeFalsy();
    });
  });

  describe(`GET /:userid/posts`, () => {
    let userid;
    let token;
    let queryString;

    const exec = () =>
      request(server)
        .get(`/users/${userid}/posts${queryString}`)
        .set('x-auth-token', token);

    beforeEach(async () => {
      userid = mongoose.Types.ObjectId();
      queryString = '';

      token = new User({
        _id: userid,
      }).generateAuthToken();

      await Post.collection.insertMany([
        {
          title: 'test1',
          text: 'test1',
          user: userid,
          isPublished: true,
        },
        {
          title: 'test2',
          text: 'test2',
          user: userid,
          isPublished: false,
        },
        {
          title: 'test3',
          text: 'test3',
          user: userid,
          isPublished: true,
        },
        {
          title: 'test4',
          text: 'test4',
          user: userid,
          isPublished: true,
        },
      ]);
    });

    it(`should return 400 if userid is an invalid objectid`, async () => {
      userid = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return limit number of posts if limit query string is provided`, async () => {
      queryString = `?limit=2`;
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it(`should skip number of posts if skip query string is provided`, async () => {
      queryString = `?skip=1`;
      const res = await exec();
      expect(res.body.length).toBe(3);
      expect(res.body[0].title).toBe('test2');
    });

    it(`should return all posts (including unpublished) if user is author`, async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
      expect(res.body.some((p) => !p.isPublished)).toBeTruthy();
    });

    it(`should return all posts (including unpublished) if user is admin`, async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      const res = await exec();
      expect(res.body.length).toBe(4);
      expect(res.body.some((p) => !p.isPublished)).toBeTruthy();
    });

    it(`should return only published posts if user is not author or admin`, async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((p) => !p.isPublished)).toBeFalsy();
    });

    it(`should return only published posts if no logged in user`, async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((p) => p.isPublished === false)).toBeFalsy();
      expect(res.body.some((p) => p.title === 'test1')).toBeTruthy();
      expect(res.body.some((p) => p.title === 'test2')).toBeFalsy();
      expect(res.body.some((p) => p.title === 'test3')).toBeTruthy();
      expect(res.body.some((p) => p.title === 'test4')).toBeTruthy();
    });

    it(`shouldn't crash if user not found`, async () => {
      userid = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(200);
      // should return an empty array
      expect(res.body.length).toBe(0);
    });
  });
});
