import mongoose from 'mongoose';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import { Post } from '../../models/post.js';
import { User } from '../../models/user.js';
import { Comment } from '../../models/comment.js';
import app from '../../startup/app.js';

let server;

describe('/posts', () => {
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
    beforeEach(async () => {
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
          isPublished: false,
          user: 2222222222222222,
        },
        {
          title: 'post3',
          text: 'post3 text',
          isPublished: true,
          user: 3333333333333333,
        },
        {
          title: 'post4',
          text: 'post4 text',
          isPublished: true,
          user: 3333333333333333,
        },
      ]);
    });

    it('should return all published posts', async () => {
      const res = await request(server).get('/posts');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((p) => p.title === 'post1')).toBeTruthy();
      expect(res.body.some((p) => p.title === 'post2')).toBeFalsy();
      expect(res.body.some((p) => p.title === 'post3')).toBeTruthy();
      expect(res.body.some((p) => p.title === 'post4')).toBeTruthy();
    });

    it(`should return the 'limit' number of posts if the take query string is provided`, async () => {
      const res = await request(server).get(`/posts?limit=2`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it(`should skip posts if skip query string is provided`, async () => {
      const res = await request(server).get(`/posts?skip=2`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it(`should include unpublished if includeunpublished query string is provided && user isAdmin`, async () => {
      const token = await new User({
        firstName: 'f',
        lastName: 'l',
        email: 'e@mail.com',
        password: 'password',
        isAdmin: true,
      }).generateAuthToken();
      const res = await request(server)
        .get(`/posts?includeunpublished=true`)
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
    });

    it(`should not include unpublished if includeunpublished qs is provider but user is not admin`, async () => {
      const token = await new User().generateAuthToken();
      const res = await request(server)
        .get(`/posts?includeunpublished=true`)
        .set('x-auth-token', token);
      expect(res.body.length).toBe(3);
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

  describe('GET /:postid', () => {
    let payload;
    let postid;
    let token;

    const exec = async () => {
      await Post.create(payload);
      return request(server).get(`/posts/${postid}`).set('x-auth-token', token);
    };

    beforeEach(async () => {
      postid = mongoose.Types.ObjectId();
      token = '';
      payload = {
        _id: postid.toHexString(),
        title: 'post1',
        text: 'post1 text',
        isPublished: true,
        user: mongoose.Types.ObjectId(),
      };
    });

    it('should return post if post is published', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', payload.title);
      expect(res.body).toHaveProperty('text', payload.text);
      expect(res.body).toHaveProperty('isPublished', payload.isPublished);
      expect(res.body).toHaveProperty('user', payload.user.toHexString());
    });

    it('should return post if post is unpublished but user is admin', async () => {
      payload.isPublished = false;
      token = new User({ isAdmin: true }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', payload.title);
      expect(res.body).toHaveProperty('text', payload.text);
      expect(res.body).toHaveProperty('isPublished', payload.isPublished);
      expect(res.body).toHaveProperty('user', payload.user.toHexString());
    });

    it('should return post if post is unpublished but user is author', async () => {
      payload.isPublished = false;
      token = new User({ _id: payload.user }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', payload.title);
      expect(res.body).toHaveProperty('text', payload.text);
      expect(res.body).toHaveProperty('isPublished', payload.isPublished);
      expect(res.body).toHaveProperty('user', payload.user.toHexString());
    });

    it('should return 400 for invalid object id', async () => {
      postid = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if no post with the given postid exists', async () => {
      postid = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return 403 if post is unpublished and user is neither post author nor an admin`, async () => {
      payload.isPublished = false;
      const res = await exec();
      expect(res.status).toBe(403);
    });
  });

  describe('PUT /:postid', () => {
    let token;
    let updatePayload;
    let userid;
    let postid;
    let user;
    let userPayload;
    let postPayload;

    const createUser = async () => {
      user = await User.create(userPayload);
    };
    const generateToken = () => {
      token = user.generateAuthToken();
    };
    const createPost = () => Post.create(postPayload);

    const exec = async () =>
      request(server)
        .put(`/posts/${postid}`)
        .set('x-auth-token', token)
        .send(updatePayload);

    beforeEach(() => {
      userid = mongoose.Types.ObjectId();
      postid = mongoose.Types.ObjectId();

      userPayload = {
        _id: userid,
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'test@email.com',
        password: 'testPassword',
        isAdmin: true,
      };

      postPayload = {
        _id: postid,
        title: 'testTitle',
        text: 'testText',
        isPublished: false,
        user: userid,
      };

      updatePayload = {
        title: 'newTitle',
        text: 'newText',
        isPublished: true,
      };
    });

    it('should return 401 if no jwt is provided', async () => {
      await createUser();
      await createPost();
      const res = await request(server)
        .put(`/posts/${postid}`)
        .send(updatePayload);

      expect(res.status).toBe(401);
    });

    it('should return 400 if invalid objectid passed for postid', async () => {
      await createUser();
      await generateToken();
      postid = 4;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 400 if title less than 1 char`, async () => {
      updatePayload.title = '';
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 400 if title more than 255 chars`, async () => {
      updatePayload.title = new Array(257).join('a');
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 400 if text less than 1 char`, async () => {
      updatePayload.text = '';
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 400 if text more than 99999 char`, async () => {
      updatePayload.text = new Array(100001).join('a');
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 400 if user not a valid objectid`, async () => {
      updatePayload.user = 1;
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 404 if post not found`, async () => {
      await createUser();
      await generateToken();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it(`should return 403 if post doesn't belong to user && user isn't an admin`, async () => {
      userPayload.isAdmin = false;
      postPayload.user = mongoose.Types.ObjectId();
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return the updated post if post belongs to user and all is well', async () => {
      userPayload.isAdmin = false;
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', postid.toHexString());
      expect(res.body).toHaveProperty('title', updatePayload.title);
      expect(res.body).toHaveProperty('text', updatePayload.text);
      expect(res.body).toHaveProperty('isPublished', updatePayload.isPublished);
      expect(res.body).toHaveProperty('user', userid.toHexString());
    });

    it('should return the updated post if user is admin and all is well', async () => {
      postPayload.user = mongoose.Types.ObjectId();
      await createUser();
      await generateToken();
      await createPost();
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', postid.toHexString());
      expect(res.body).toHaveProperty('title', updatePayload.title);
      expect(res.body).toHaveProperty('text', updatePayload.text);
      expect(res.body).toHaveProperty('isPublished', updatePayload.isPublished);
      expect(res.body).toHaveProperty('user', postPayload.user.toHexString());
    });
  });

  describe('DELETE /:postid', () => {
    let userid;
    let postid;
    let postPayload;
    let userPayload;
    let token;

    const exec = async () => {
      token = new User(userPayload).generateAuthToken();
      await Post.create(postPayload);
      return request(server)
        .delete(`/posts/${postid}`)
        .set('x-auth-token', token);
    };

    beforeEach(() => {
      userid = mongoose.Types.ObjectId();
      postid = mongoose.Types.ObjectId();
      postPayload = {
        _id: postid.toHexString(),
        title: 'testTitle',
        text: 'testText',
        isPublished: false,
        user: userid.toHexString(),
      };
      userPayload = {
        _id: userid.toHexString(),
        firstName: 'testFirstName',
        lastName: 'testLastName',
        email: 'test@email.com',
        password: 'testPassword',
        isAdmin: true,
      };
    });

    it(`should return 401 if no jwt is provided`, async () => {
      const res = await request(server).delete(`/posts/${postid}`);

      expect(res.status).toBe(401);
    });

    it(`should return 400 if postid is an invalid objectid`, async () => {
      postid = 1234;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 404 if post not found`, async () => {
      postid = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it(`should return 403 if post is not user's && user is not admin`, async () => {
      postPayload.user = mongoose.Types.ObjectId();
      userPayload.isAdmin = false;
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it(`should return the deleted post, but the post should be deleted`, async () => {
      const res = await exec();
      const post = await Post.findById(res.body._id);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(postPayload);
      expect(post).toBeFalsy();
    });
  });

  describe('POST /:postid/publish', () => {
    let postid;
    let userid;
    let token;
    let postPayload;

    const exec = async () => {
      await Post.create(postPayload);

      return request(server)
        .post(`/posts/${postid}/publish`)
        .set('x-auth-token', token);
    };

    beforeEach(async () => {
      postid = mongoose.Types.ObjectId();
      userid = mongoose.Types.ObjectId();
      postPayload = {
        _id: postid,
        title: 't',
        text: 't',
        isPublished: false,
        user: userid,
      };

      token = new User({ _id: userid }).generateAuthToken();
    });

    it(`should return 400 if postid is not valid objectId`, async () => {
      postid = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 403 if no logged in user`, async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it(`should return 403 if user is neither author nor admin`, async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it(`should return 404 if post not found`, async () => {
      postid = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should publish the post if user is admin`, async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      const res = await exec();
      const updatedPost = await Post.findById(postid);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(postid.toHexString());
      expect(res.body.isPublished).toBe(true);
      expect(updatedPost.isPublished).toBe(true);
    });

    it(`should publish the post if user is author`, async () => {
      const res = await exec();
      const updatedPost = await Post.findById(postid);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(postid.toHexString());
      expect(res.body.isPublished).toBe(true);
      expect(updatedPost.isPublished).toBe(true);
    });
  });

  // describe('POST /:postid/unpublish', () => {

  // })

  describe(`GET /:postid/comments`, () => {
    let postid;
    let userid;
    let postPayload;
    let queryString;

    const createPostAndComments = async () => {
      await Post.create(postPayload);
      await Comment.create({
        text: 'comment1Text',
        author: 'comment1Author',
        email: 'test@email.com',
        post: postid,
      });
      await Comment.create({
        text: 'comment2Text',
        author: 'comment2Author',
        email: 'test@email.com',
        post: postid,
      });
      await Comment.create({
        text: 'comment3Text',
        author: 'comment3Author',
        email: 'test@email.com',
        post: postid,
      });
    };

    const exec = () =>
      request(server).get(`/posts/${postid}/comments${queryString}`);

    beforeEach(() => {
      postid = mongoose.Types.ObjectId();
      userid = mongoose.Types.ObjectId();
      postPayload = {
        _id: postid,
        title: 'testTitle',
        text: 'testText',
        isPublished: true,
        user: userid.toHexString(),
      };
      queryString = ``;
    });

    it(`should return the limit number of comments if limit query string is provided`, async () => {
      queryString = `?limit=2`;
      await createPostAndComments();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it(`should skip the skip number of comments if skip query string is provided`, async () => {
      queryString = `?skip=1`;
      await createPostAndComments();
      const res = await exec();
      expect(res.body.length).toBe(2);
      expect(res.body[0].text).toBe('comment2Text');
    });

    it(`should return 400 if postid is an invalid objectid`, async () => {
      postid = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 403 if post is unpublished`, async () => {
      postPayload.isPublished = false;
      await createPostAndComments();
      const res = await request(server).get(`/posts/${postid}/comments`);

      expect(res.status).toBe(403);
    });

    it(`should return the given posts' comments`, async () => {
      await createPostAndComments();
      const res = await request(server).get(`/posts/${postid}/comments`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((c) => c.text === 'comment1Text')).toBeTruthy();
      expect(res.body.some((c) => c.text === 'comment2Text')).toBeTruthy();
      expect(res.body.some((c) => c.text === 'comment3Text')).toBeTruthy();
    });
  });

  describe(`POST /:postid/comments`, () => {
    let postid;
    let reqPayload;
    let postPayload;

    const exec = async () => {
      await Post.create(postPayload);
      return request(server).post(`/posts/${postid}/comments`).send(reqPayload);
    };

    beforeEach(async () => {
      postid = mongoose.Types.ObjectId();
      reqPayload = {
        text: 'testText',
        author: 'testAuthor',
        email: 'test@email.com',
        post: postid.toHexString(),
      };
      postPayload = {
        _id: postid,
        title: 'testTitle',
        text: 'testText',
        isPublished: true,
        user: mongoose.Types.ObjectId(),
      };
    });

    it(`should return 403 if post is unpublished`, async () => {
      postPayload.isPublished = false;
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it(`should return 400 if postid is an invalid objectid`, async () => {
      postid = 1234;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it(`should return 400 if text is less than 1 char`, async () => {
      reqPayload.text = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if text is more than 255 char`, async () => {
      reqPayload.text = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if author is less than 1 char`, async () => {
      reqPayload.author = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if author is more than 9999 char`, async () => {
      reqPayload.author = new Array(10001).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email is less than 1 char`, async () => {
      reqPayload.email = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email is more than 255 char`, async () => {
      reqPayload.email = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if post not found`, async () => {
      postid = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return created post && post should be in db`, async () => {
      const res = await exec();
      const comment = await Comment.findOne({ text: reqPayload.text });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(reqPayload);
      expect(comment).toBeTruthy();
    });
  });

  describe(`GET /:postid/comments/:commentid`, () => {
    let postid;
    let commentid;
    let postPayload;
    let commentPayload;

    const exec = async () => {
      await Post.create(postPayload);
      await Comment.create(commentPayload);
      return request(server).get(`/posts/${postid}/comments/${commentid}`);
    };

    beforeEach(async () => {
      postid = mongoose.Types.ObjectId();
      postPayload = {
        _id: postid,
        title: 'title',
        text: 'text',
        isPublished: true,
        user: mongoose.Types.ObjectId(),
      };
      commentid = mongoose.Types.ObjectId();
      commentPayload = {
        _id: commentid.toHexString(),
        text: 'testText',
        author: 'testAuthor',
        email: 'test@email.com',
        post: postid.toHexString(),
      };
    });

    it(`should return 400 if comment's post does not match given postid`, async () => {
      commentPayload.post = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if post not found`, async () => {
      postPayload._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return 404 if post is unpublished`, async () => {
      postPayload.isPublished = false;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return 400 if postid is invalid objectid`, async () => {
      postid = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if commentid is invalid objectid`, async () => {
      commentid = 1234;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if comment not found`, async () => {
      commentid = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return a comment`, async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(commentPayload);
    });
  });

  describe(`PUT /:postid/comments/:commentid`, () => {
    let postid;
    let commentid;
    let reqPayload;
    let userPayload;
    let token;

    const createToken = async () => {
      token = await new User(userPayload).generateAuthToken();
    };
    const exec = () =>
      request(server)
        .put(`/posts/${postid}/comments/${commentid}`)
        .set('x-auth-token', token)
        .send(reqPayload);

    beforeEach(async () => {
      postid = mongoose.Types.ObjectId();
      commentid = mongoose.Types.ObjectId();
      reqPayload = {
        text: 'updatedText',
        author: 'updatedAuthor',
        email: 'updated@email.com',
      };
      userPayload = {
        firstName: 'testFirst',
        lastName: 'testLast',
        email: 'test@email.com',
        password: 'testPassword',
        isAdmin: true,
      };
      await Comment.create({
        _id: commentid.toHexString(),
        text: 'testText',
        author: 'testAuthor',
        email: 'test@email.com',
        post: postid.toHexString(),
      });
    });

    it(`should return 401 if no token provided`, async () => {
      const res = await request(server)
        .put(`/posts/${postid}/comments/${commentid}`)
        .send(reqPayload);
      expect(res.status).toBe(401);
    });

    it(`should return 403 if user not admin`, async () => {
      userPayload.isAdmin = false;
      await createToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it(`should return 400 if postid is invalid objectid`, async () => {
      postid = 1234;
      await createToken();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if commentid is invalid objectid`, async () => {
      commentid = 1234;
      await createToken();
      const res = await exec();
      expect(res.status).toBe(400);
    });
    // validators
    it(`should return 400 if text is less than 1 char`, async () => {
      reqPayload.text = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if text is more than 255 char`, async () => {
      reqPayload.text = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if author is less than 1 char`, async () => {
      reqPayload.author = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if author is more than 9999 char`, async () => {
      reqPayload.author = new Array(10001).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email is less than 1 char`, async () => {
      reqPayload.email = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if email is more than 255 char`, async () => {
      reqPayload.email = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if comment not found`, async () => {
      commentid = mongoose.Types.ObjectId();
      await createToken();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should update and return comment`, async () => {
      await createToken();
      const res = await exec();
      const comment = await Comment.findById(commentid);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('text', 'updatedText');
      expect(res.body).toHaveProperty('author', 'updatedAuthor');
      expect(res.body).toHaveProperty('email', 'updated@email.com');
      expect(comment).toHaveProperty('text', 'updatedText');
      expect(comment).toHaveProperty('author', 'updatedAuthor');
      expect(comment).toHaveProperty('email', 'updated@email.com');
    });
  });

  describe(`DELETE /:postid/comments/:commentid`, () => {
    let userid;
    let postid;
    let commentid;
    let userPayload;
    let postPayload;
    let commentPayload;
    let token;

    const makePostAndComment = async () => {
      await Post.create(postPayload);
      await Comment.create(commentPayload);
    };

    const createToken = () => {
      token = new User(userPayload).generateAuthToken();
    };

    const exec = () =>
      request(server)
        .delete(`/posts/${postid}/comments/${commentid}`)
        .set('x-auth-token', token);

    beforeEach(() => {
      userid = mongoose.Types.ObjectId();
      postid = mongoose.Types.ObjectId();
      commentid = mongoose.Types.ObjectId();

      postPayload = {
        _id: postid.toHexString(),
        title: 'testTitle',
        text: 'testText',
        isPublished: false,
        user: userid.toHexString(),
      };

      commentPayload = {
        _id: commentid.toHexString(),
        text: 'testText',
        author: 'testAuthor',
        email: 'test@email.com',
        post: postid.toHexString(),
      };

      userPayload = {
        firstName: 'testFirst',
        lastName: 'testLast',
        email: 'test@email.com',
        password: 'testPassword',
        isAdmin: true,
      };
    });

    it(`should return 401 if no jwt provided`, async () => {
      const res = await request(server).delete(
        `/posts/${postid}/comments/${commentid}`
      );
      expect(res.status).toBe(401);
    });

    it(`should return 400 if postid is an invalid objectid`, async () => {
      postid = 1234;
      await createToken();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 400 if commentid is an invalid objectid`, async () => {
      commentid = 1234;
      await createToken();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should return 404 if post not found`, async () => {
      postid = mongoose.Types.ObjectId();
      await makePostAndComment();
      await createToken();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it(`should return 403 if post isn't user's and user isn't' admin`, async () => {
      postPayload.user = mongoose.Types.ObjectId();
      userPayload.isAdmin = false;
      await makePostAndComment();
      await createToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it(`should return 400 if comment's post doesn't match given post`, async () => {
      commentPayload.post = mongoose.Types.ObjectId();
      await makePostAndComment();
      await createToken();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it(`should delete and return comment`, async () => {
      await makePostAndComment();
      await createToken();
      const res = await exec();
      const comment = await Comment.findById(commentid);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(commentPayload);
      expect(comment).toBeFalsy();
    });
  });
});
