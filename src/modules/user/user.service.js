const User = require('./user.model');
const { error, HTTP_STATUS } = require('../../utils/response');
const { sanitizeUser, sanitizeUsers } = require('../../utils/sanitize');

class UserService {
  async getAllUsers() {
    const users = await User.find({ isActive: true });
    return sanitizeUsers(users);
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      throw error(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return sanitizeUser(user);
  }

  async updateUser(userId, updateData) {
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      throw error(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        throw error(HTTP_STATUS.CONFLICT, 'Email already in use');
      }
    }

    Object.assign(user, updateData);
    await user.save();

    return sanitizeUser(user);
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      throw error(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    user.isActive = false;
    await user.save();

    return { message: 'User deleted successfully' };
  }

  async getUserProfile(userId) {
    return this.getUserById(userId);
  }
}

module.exports = new UserService();
