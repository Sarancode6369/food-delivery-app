// Central error handling so customers never see raw technical errors

const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.publicMessage || 'Something went wrong. Please try again.',
  });
};

module.exports = { notFound, errorHandler };
