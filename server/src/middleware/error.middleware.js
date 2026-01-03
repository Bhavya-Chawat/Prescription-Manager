const { ApiError } = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal Server Error',
    details: err.details || undefined,
  };
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  res.status(status).json(payload);
}

module.exports = { errorHandler };