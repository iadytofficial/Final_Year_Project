function notFoundHandler(req, res, next) {
  res.status(404).json({ code: 'SYS001', message: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'SYS001';
  const message = err.message || 'Internal server error';
  const details = process.env.NODE_ENV === 'production' ? undefined : err.stack;
  res.status(status).json({ code, message, details });
}

module.exports = { errorHandler, notFoundHandler };
