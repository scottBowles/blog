import mongoose from 'mongoose';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

export default function () {
  const connectionString =
    process.env.NODE_ENV === 'test'
      ? process.env.DB_URI_TEST
      : process.env.DB_URI;

  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => winston.info('Connected to MongoDB...'));
}
