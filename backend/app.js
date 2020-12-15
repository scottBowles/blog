require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

/* Set up mongoose connection */
require('./config/database');

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
