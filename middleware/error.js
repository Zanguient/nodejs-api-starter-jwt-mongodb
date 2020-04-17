const ErrorHandler = require('../utils/ErrorHandler');

const errorMiddleware = (err, req, res, next) => {
  const defaultCode = 500;
  const defaultMessage = 'Internal Server Error';

  let error = err;

  if (err.name === 'ValidationError') { // Mongoose validation error
    error = new ErrorHandler('Validation error', 400);
    error.data = err.errors;
    if (error.data) {
      // remove details
      Object.values(error.data).map(prop => {
        prop.properties && delete prop.properties;
        prop.message && delete prop.message;
      });
    }
  } else if (err.code === 11000) { // Mongoose duplicate key
    if (err.keyValue && err.keyValue.email) {
      // if email already exists, send generic error response
      error = new ErrorHandler(defaultMessage, defaultCode);
    } else {
      error = new ErrorHandler('Duplicate key', 400);
    }
  }
  if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') { // invalid token
      error = new ErrorHandler('Token error', 401);
    }
  }

  let errorObj = {...error};
  errorObj.message = error.message || defaultMessage;
  if (process.env.NODE_ENV === 'development') {
    errorObj.stack = error.stack;
  }
  res.status(error.statusCode || defaultCode).json({
    success: false,
    error: errorObj
  });
}

module.exports = errorMiddleware;