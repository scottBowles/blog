import winston from 'winston';
// import 'winston-mongodb';
import 'express-async-errors';

export default function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.File({ filename: '../logfile.log', level: 'error' })
  );

  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: process.env.DB_URI,
  //     options: { useUnifiedTopology: true },
  //   })
  // );
}
