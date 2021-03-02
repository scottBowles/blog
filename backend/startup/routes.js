import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import createError from 'http-errors';

import indexRouter from '../routes/index.js';
import usersRouter from '../routes/users.js';
import postsRouter from '../routes/posts.js';
import errorHandler from '../middleware/error.js';

export default function (app) {
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/posts', postsRouter);
  /* Catch 404s and forward to error handler */
  app.use((req, res, next) => next(createError(404)));
  app.use(errorHandler);
}
