export class AppError extends Error {
  constructor(message, statusCode = 500, step = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.step = step;
    this.details = details;
  }
}
