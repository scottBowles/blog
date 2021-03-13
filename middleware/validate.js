export default function validate(validator, dataFromReq = (req) => req.body) {
  return (req, res, next) => {
    const { error } = validator(dataFromReq(req));
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
}