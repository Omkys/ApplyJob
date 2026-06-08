import { AppError } from '../utils/AppError.js';

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    console.error('[Error]', err.message);
    console.error('[Error] Stack:', err.stack);
  }

  const response = {
    success: false,
    message,
  };

  if (err.step) response.step = err.step;
  if (err.details) response.details = err.details;
  if (!err.isOperational && process.env.NODE_ENV !== 'production') {
    response.error = err.message;
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    step: 'route_not_found',
  });
}
