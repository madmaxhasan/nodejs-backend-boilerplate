const express = require('express');
const authController = require('./auth.controller');
const { validate } = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema, refreshTokenSchema } = require('./auth.schema');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authLimiter } = require('../../middlewares/rate-limit.middleware');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

router.post('/logout', authenticate, authController.logout);

module.exports = router;
