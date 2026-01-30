const mongoose = require('mongoose');
const User = require('../src/modules/user/user.model');
const env = require('../src/config/env');
const logger = require('../src/config/logger');
const { USER_ROLES } = require('../src/utils/constants');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: USER_ROLES.ADMIN,
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'User123!',
    role: USER_ROLES.USER,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.db.uri);
    logger.info('Connected to MongoDB');

    await User.deleteMany({});
    logger.info('Cleared existing users');

    await User.insertMany(users);
    logger.info('Seeded users successfully');

    logger.info('\n=== Seed Data ===');
    logger.info('Admin: admin@example.com / Admin123!');
    logger.info('User: user@example.com / User123!');
    logger.info('=================\n');

    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
