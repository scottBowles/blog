import { models, validate } from '../models/index.js';

export default function (app) {
  /* Add a context object */
  app.use((req, res, next) => {
    req.context = { models, validate };
    next();
  });
}