import dotenv from 'dotenv';
import express from 'express';
import winston from 'winston';

import startup from './startup/index.js';

const app = express();
dotenv.config();
startup.logging();
startup.database();
startup.validation();
startup.context(app);
startup.routes(app);

/* Start server */
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Server listening on port ${port}`));
