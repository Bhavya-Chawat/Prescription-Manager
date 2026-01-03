function requestLogger(req, res, next) {
  res.on('finish', () => {
    const { method, originalUrl } = req;
    const status = res.statusCode;
    console.log(`${method} ${originalUrl} -> ${status}`);
  });
  next();
}

module.exports = { requestLogger };