const express = require('express');
const createError = require('http-errors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/database');

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  console.error(err.stack);
  res.status(err.status || 500).json({ status: 'error', statusCode, message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
