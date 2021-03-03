import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import createError from 'http-errors';

import indexRouter from '../routes/index.js';
import usersRouter from '../routes/users.js';
import postsRouter from '../routes/posts.js';
import authRouter from '../routes/auth.js';
import errorHandler from '../middleware/error.js';

export default function (app) {
  /* Middleware */
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json());

  /* Routes */
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/posts', postsRouter);
  app.use('/auth', authRouter);

  /* Catch 404s and forward to error handler */
  app.use((req, res, next) => next(createError(404)));

  /* Global error handler */
  app.use(errorHandler);
}
