import 'regenerator-runtime/runtime';
import request from 'supertest';
import app from '../../startup/app.js';
import { User } from '../../models/user.js';
import { Post } from '../../models/post.js';

/**
 * NOTE: This test checks each execution path but does not have access to the
 * request object in media res, so it is unable to test that req.user is added
 * correctly. That is tested in the auth.test.js unit test.
 */

let server;

describe('auth middleware', () => {
  beforeEach(() => {
    server = app.listen(process.env.PORT_TEST);
  });
  afterEach(async () => {
    await Post.remove({});
    await server.close();
  });

  let token;

  const payload = {
    title: 'title',
    text: 'text',
    isPublished: true,
  };

  const exec = () =>
    request(server).post('/posts').set('x-auth-token', token).send(payload);

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
