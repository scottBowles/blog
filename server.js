import winston from 'winston';
import app from './startup/app.js';

/* Start server */
const port = process.env.PORT || 3000;
app.listen(port, () =>
  winston.info(
    `Server listening on port ${port} in ${process.env.NODE_ENV} environment`
  )
);
