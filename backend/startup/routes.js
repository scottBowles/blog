import express from 'express';
import helmet from 'helmet';
import createError from 'http-errors';

import indexRouter from '../routes/index.js';
import usersRouter from '../routes/users.js';
import postsRouter from '../routes/posts.js';
import errorHandler from '../middleware/error.js';
import auth from '../middleware/auth.js';

export default function (app) {
  /* Middleware */
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  /* Routes */
  app.use('/', auth, indexRouter);
  app.use('/users', auth, usersRouter);
  app.use('/posts', auth, postsRouter);

  /* Catch 404s and forward to error handler */
  app.use((req, res, next) => next(createError(404)));

  /* Global error handler */
  app.use(errorHandler);
}
