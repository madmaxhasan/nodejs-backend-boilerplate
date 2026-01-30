const express = require('express');
const userController = require('./user.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { getUserSchema, updateUserSchema, deleteUserSchema } = require('./user.schema');
const { USER_ROLES } = require('../../utils/constants');

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);

router.get('/', authenticate, authorize(USER_ROLES.ADMIN), userController.getAllUsers);

router.get(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(getUserSchema),
  userController.getUserById
);

router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(deleteUserSchema),
  userController.deleteUser
);

module.exports = router;
