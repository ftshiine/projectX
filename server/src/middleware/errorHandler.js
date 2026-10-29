export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  const statusCode = err.name === 'ValidationError' ? 400 : err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors ? Object.values(err.errors).map((e) => e.message) : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

