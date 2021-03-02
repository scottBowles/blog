import mongoose from 'mongoose';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

export default function () {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => winston.info('Connected to MongoDB...'));
}
