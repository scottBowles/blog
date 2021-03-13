import Joi from 'joi';
import joiObjectid from 'joi-objectid';

export default function () {
  Joi.objectId = joiObjectid(Joi);
}