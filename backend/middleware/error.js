import winston from 'winston';

export default function (err, req, res, next) {
  winston.error(err.message);
  const { statusCode, message } = err;
  console.error(err.stack);
  res.status(err.status || 500).json({ status: 'error', statusCode, message });
}
