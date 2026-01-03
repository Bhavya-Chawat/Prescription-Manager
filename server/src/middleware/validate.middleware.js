// Zod validation middleware
const { ZodError } = require('zod');
const { ApiError } = require('../utils/ApiError');

function validate(schema) {
  return (req, res, next) => {
    try {
      const data = {
        body: req.body,
        params: req.params,
        query: req.query,
      };
      schema.parse(data);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new ApiError(400, 'Validation failed', err.flatten()))
      }
      next(err);
    }
  };
}

module.exports = { validate };