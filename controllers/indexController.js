import bcrypt from 'bcrypt';

export function index(req, res, next) {
  return res.json({
    description:
      'This is a blog REST api allowing multiple users, admins, posts, and comments. For documentation please see https://github.com/scottBowles/blog.',
    routes: {
      '/': { GET: 'Get abbreviated documentation' },
      '/login': { POST: 'Log in with credentials' },
      '/me': { GET: 'Get current logged in user' },
      '/users': {
        GET: 'Get all users',
        POST: 'Register a new user',
      },
      '/users/{userid}': {
        GET: 'Get information about a specific user',
        PUT: 'Updated information about a specific user',
        DELETE: 'Remove a user',
      },
      '/users/{userid}/posts': {
        GET: `Get a specific user's posts`,
      },
      '/posts': {
        GET: 'Get all posts',
        POST: 'Create a new post',
      },
      '/posts/{postid}': {
        GET: 'Get a specific post',
        PUT: 'Edit a specific post',
        DELETE: 'Remove a specific post',
      },
      '/posts/{postid}/publish': {
        POST: 'Publish an unpublished post',
      },
      '/posts/{postid}/unpublish': {
        POST: 'Unpublish an published post',
      },
      '/posts/{postid}/comments': {
        GET: 'Get the comments on a specific post',
        POST: 'Add a comment on a specific post',
      },
      '/posts/{postid}/comments/{commentid}': {
        GET: 'Get a specific comment',
        PUT: 'Update a specific comment',
        DELETE: 'Remove a specific comment',
      },
    },
  });
}

export async function me(req, res, next) {
  /** Get user from db, excluding password */
  const user = await req.context.models.User.findById(req.user._id).select(
    '-password'
  );
  if (!user) return res.status(404).json('User not found');

  return res.json(user);
}

export async function login(req, res, next) {
  /** Fetch user */
  const user = await req.context.models.User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json('Invalid email or password');

  /** Validate password */
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json('Invalid email or password');

  /** Generate jwt and send to client */
  const token = user.generateAuthToken();
  res.json(token);
}
