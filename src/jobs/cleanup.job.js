const User = require('../modules/user/user.model');
const logger = require('../config/logger');

const cleanupInactiveUsers = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await User.deleteMany({
      isActive: false,
      updatedAt: { $lt: thirtyDaysAgo },
    });

    logger.info(`Cleanup job: Removed ${result.deletedCount} inactive users`);
    return result.deletedCount;
  } catch (error) {
    logger.error('Cleanup job failed:', error);
    throw error;
  }
};

module.exports = {
  cleanupInactiveUsers,
};
