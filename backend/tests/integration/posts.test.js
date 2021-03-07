import mongoose from 'mongoose';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import { Post } from '../../models/post.js';
import { User } from '../../models/user.js';
import app from '../../startup/app.js';

let server;

describe('/posts', () => {
  beforeEach(() => {
    server = app.listen(process.env.PORT_TEST);
  });
  afterEach(async () => {
    server.close();
    await Post.remove({});
  });

  describe('GET /', () => {
    it('should return all posts', async () => {
      await Post.collection.insertMany([
        {
          title: 'post1',
          text: 'post1 text',
          isPublished: true,
          user: 1111111111111111,
        },
        {
          title: 'post2',
          text: 'post2 text',
          isPublished: true,
          user: 2222222222222222,
        },
        {
          title: 'post3',
          text: 'post3 text',
          isPublished: true,
          user: 3333333333333333,
        },
      ]);
      const res = await request(server).get('/posts');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((p) => p.title === 'post1')).toBeTruthy();
      expect(res.body.some((p) => p.title === 'post2')).toBeTruthy();
      expect(res.body.some((p) => p.title === 'post3')).toBeTruthy();
    });
  });

  describe('GET /:postid', () => {
    it('should return a post if valid id is passed', async () => {
      const payload = {
        title: 'post1',
        text: 'post1 text',
        isPublished: true,
        user: mongoose.Types.ObjectId(),
      };
      const post = await Post.create(payload);
      const res = await request(server).get(`/posts/${post._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', payload.title);
      expect(res.body).toHaveProperty('text', payload.text);
      expect(res.body).toHaveProperty('isPublished', payload.isPublished);
      expect(res.body).toHaveProperty('user', payload.user.toHexString());
    });

    it('should return 400 for invalid object id', async () => {
      const res = await request(server).get('/posts/1');
      expect(res.status).toBe(400);
    });

    it('should return 404 if no post with the given postid exists', async () => {
      const validId = mongoose.Types.ObjectId();
      const res = await request(server).get(`/posts/${validId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let payload;

    const exec = async () =>
      request(server).post('/posts').set('x-auth-token', token).send(payload);

    beforeEach(() => {
      token = new User().generateAuthToken();
      payload = {
        title: 'title',
        text: 'text',
        isPublished: true,
      };
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if post title less than 1 char', async () => {
      payload.title = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if post title more than 255 char', async () => {
      payload.title = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if post text less than 1 char', async () => {
      payload.text = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if post text more than 99999 char', async () => {
      payload.text = new Array(100002).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should not use user if provided (should use logged in user instead)', async () => {
      payload.user = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.body.user).not.toBe(payload.user);
    });

    it('should save the post if it is valid', async () => {
      const res = await exec();
      const post = await Post.find({ title: 'title' });
      expect(res.status).toBe(200);
      expect(post).not.toBeNull();
    });

    it('should return the post if it is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', payload.title);
      expect(res.body).toHaveProperty('text', payload.text);
      expect(res.body).toHaveProperty('isPublished', payload.isPublished);
    });
  });
});
