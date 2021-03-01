// import models from './models/index.js';

import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';

/* Set up mongoose connection */
import './config/database.js';

dotenv.config();

/* Create express app */
const app = express();

/* Add middleware */
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Direct routes */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

/* Catch 404s and forward to error handler */
app.use((req, res, next) => next(createError(404)));

/* Central error handler */
app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  console.error(err.stack);
  res.status(err.status || 500).json({ status: 'error', statusCode, message });
});

/* Start server */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
