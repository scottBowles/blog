import dotenv from 'dotenv';
import express from 'express';

import logging from './logging.js';
import database from './database.js';
import validation from './validation.js';
import context from './context.js';
import routes from './routes.js';

const app = express();
dotenv.config();
logging();
database();
validation();
context(app);
routes(app);

export default app;
