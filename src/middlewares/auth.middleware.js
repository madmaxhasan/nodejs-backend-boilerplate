const { verifyToken } = require('../utils/jwt');
const { error, HTTP_STATUS } = require('../utils/response');
const { TOKEN_TYPES } = require('../utils/constants');
const User = require('../modules/user/user.model');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(error(HTTP_STATUS.UNAUTHORIZED, 'No token provided'));
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token, TOKEN_TYPES.ACCESS);

    if (decoded.type !== TOKEN_TYPES.ACCESS) {
      return next(error(HTTP_STATUS.UNAUTHORIZED, 'Invalid token type'));
    }

    const user = await User.findById(decoded.userId).select('-password -refreshToken');

    if (!user) {
      return next(error(HTTP_STATUS.UNAUTHORIZED, 'User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(error(HTTP_STATUS.UNAUTHORIZED, 'Invalid token'));
    }
    if (err.name === 'TokenExpiredError') {
      return next(error(HTTP_STATUS.UNAUTHORIZED, 'Token expired'));
    }
    next(err);
  }
};

module.exports = { authenticate };
