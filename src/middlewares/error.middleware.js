const logger = require('../config/logger');
const { ApiError, HTTP_STATUS } = require('../utils/response');
const env = require('../config/env');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

const errorHandler = (err, req, res) => {
  let { statusCode, message } = err;

  if (env.nodeEnv === 'production' && !err.isOperational) {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    statusCode,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  };

  if (env.nodeEnv === 'development') {
    logger.error(err);
  }

  res.status(statusCode).json(response);
};

const notFound = (req, res, next) => {
  const error = new ApiError(HTTP_STATUS.NOT_FOUND, 'Route not found');
  next(error);
};

module.exports = {
  errorConverter,
  errorHandler,
  notFound,
};
