const authService = require('./auth.service');
const { success, HTTP_STATUS } = require('../../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.validated.body);
      success(res, HTTP_STATUS.CREATED, 'User registered successfully', result);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.validated.body;
      const result = await authService.login(email, password);
      success(res, HTTP_STATUS.OK, 'Login successful', result);
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.validated.body;
      const result = await authService.refreshToken(refreshToken);
      success(res, HTTP_STATUS.OK, 'Token refreshed successfully', result);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.user._id);
      success(res, HTTP_STATUS.OK, 'Logout successful');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
