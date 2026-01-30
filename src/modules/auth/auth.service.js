const User = require('../user/user.model');
const { generateAuthTokens, verifyToken } = require('../../utils/jwt');
const { error, HTTP_STATUS } = require('../../utils/response');
const { sanitizeUser } = require('../../utils/sanitize');
const { TOKEN_TYPES } = require('../../utils/constants');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw error(HTTP_STATUS.CONFLICT, 'Email already registered');
    }

    const user = await User.create(userData);
    const tokens = generateAuthTokens(user._id);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: sanitizeUser(user),
      tokens,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email, isActive: true }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw error(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    const tokens = generateAuthTokens(user._id);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = verifyToken(refreshToken, TOKEN_TYPES.REFRESH);

      if (decoded.type !== TOKEN_TYPES.REFRESH) {
        throw error(HTTP_STATUS.UNAUTHORIZED, 'Invalid token type');
      }

      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || !user.isActive) {
        throw error(HTTP_STATUS.UNAUTHORIZED, 'User not found');
      }

      if (user.refreshToken !== refreshToken) {
        throw error(HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token');
      }

      const tokens = generateAuthTokens(user._id);

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return {
        tokens,
      };
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        throw error(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
      }
      throw err;
    }
  }

  async logout(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw error(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    user.refreshToken = null;
    await user.save();

    return { message: 'Logged out successfully' };
  }
}

module.exports = new AuthService();
