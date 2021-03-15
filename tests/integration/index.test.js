import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import { Post } from '../../models/post.js';
import { User } from '../../models/user.js';
import { Comment } from '../../models/comment.js';
import app from '../../startup/app.js';

let server;

describe('/', () => {
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
    it('should return a 200 response', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /me', () => {
    let userid;
    let token;
    let user;
    const createToken = () => {
      token = user.generateAuthToken();
    };
    const exec = () => request(server).get('/me').set('x-auth-token', token);

    beforeEach(async () => {
      userid = mongoose.Types.ObjectId().toHexString();
      user = await User.create({
        _id: userid,
        firstName: 'testFirst',
        lastName: 'testLast',
        email: 'test@email.com',
        password: 'testPassword',
        isAdmin: false,
      });
    });

    it(`should return 401 if jwt not provided`, async () => {
      const res = await request(server).get('/me');
      expect(res.status).toBe(401);
    });

    it(`should return 400 if invalid jwt provided`, async () => {
      token = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if user not found`, async () => {
      userid = mongoose.Types.ObjectId().toHexString();
      token = new User({
        firstName: 'f',
        lastName: 'l',
        email: 'a@b.c',
        password: '12345678',
      }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return user with no password value`, async () => {
      createToken();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', userid);
      expect(res.body).toHaveProperty('isAdmin', false);
      expect(res.body).not.toHaveProperty('password');
    });
  });

  describe('POST /login', () => {
    let userid;
    let password;
    let email;

    const exec = () => request(server).post('/login').send({ email, password });

    beforeEach(async () => {
      userid = mongoose.Types.ObjectId().toHexString();
      email = 'test@email.com';
      password = 'password';
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      await User.create({
        _id: userid,
        firstName: 'testFirst',
        lastName: 'testLast',
        email,
        password: hashed,
        isAdmin: false,
      });
    });

    it(`should return 400 if email provided is not a valid email`, async () => {
      email = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email provided is more than 255 characters`, async () => {
      email = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if password provided is less than 8 characters`, async () => {
      password = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if password provided is more than 255 characters`, async () => {
      password = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if an invalid email is provided`, async () => {
      email = 'bad@email.com';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if an invalid password is provided`, async () => {
      password = 'badpassword';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return a valid token with the given payload`, async () => {
      const res = await request(server)
        .post('/login')
        .send({ email: 'test@email.com', password: 'password' });
      const decoded = await jwt.verify(res.body, process.env.JWT_PRIVATE_KEY);
      expect(res.status).toBe(200);
      expect(decoded).toHaveProperty('_id', userid);
      expect(decoded).toHaveProperty('isAdmin', false);
    });
  });
});
