const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/ApiError');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) return next(new ApiError(401, 'Missing Authorization token'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = { auth };