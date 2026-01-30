const { error, HTTP_STATUS } = require('../utils/response');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(error(HTTP_STATUS.UNAUTHORIZED, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        error(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action')
      );
    }

    next();
  };
};

module.exports = { authorize };
