const { HTTP_STATUS } = require('./constants');

class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const success = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};

const error = (statusCode, message) => {
  return new ApiError(statusCode, message);
};

module.exports = {
  ApiResponse,
  ApiError,
  success,
  error,
  HTTP_STATUS,
};
