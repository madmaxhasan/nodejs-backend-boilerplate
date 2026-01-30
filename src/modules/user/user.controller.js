const userService = require('./user.service');
const { success, HTTP_STATUS } = require('../../utils/response');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      success(res, HTTP_STATUS.OK, 'Users retrieved successfully', { users });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      success(res, HTTP_STATUS.OK, 'User retrieved successfully', { user });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.validated.body);
      success(res, HTTP_STATUS.OK, 'User updated successfully', { user });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      success(res, HTTP_STATUS.OK, 'User deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserProfile(req.user._id);
      success(res, HTTP_STATUS.OK, 'Profile retrieved successfully', { user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
